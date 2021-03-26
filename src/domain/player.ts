import { Color } from "../utils/constants";
import { Clonable } from "./clonable";
import { EdgeType, GraphNode, NodeInfo } from "./graphnode";

export interface UnknownPlayer {
  role: Role;
  location: NodeInfo | null;
  id: number;
  color: Color;
  taxiTickets?: number;
  locationKnownToDetectives?: GraphNode | null;
  turnCounterForLocation?: number | null;
}
export abstract class Player implements Clonable<Player> {
  readonly role: Role;
  readonly id: number;
  location: GraphNode | null;
  color: Color;

  constructor(
    role: Role,
    location: GraphNode | null,
    id: number,
    color: Color
  ) {
    this.role = role;
    this.location = location;
    this.id = id;
    this.color = color;
  }

  /**
   * Returns a deep copy of the player, EXCLUDING location
   * @returns Player
   */
  clone(): Player {
    throw Error("Not implemented");
  }
}

export class Detective extends Player implements Clonable<Detective> {
  taxiTickets: number;

  constructor(
    location: GraphNode | null,
    id: number,
    color: Color,
    taxiTickets: number
  ) {
    super(Role.DETECTIVE, location, id, color);
    this.taxiTickets = taxiTickets;
  }
  /**
   * A copy of this detective. Location is copied as a reference
   * @returns {Detective}
   */
  clone(): Detective {
    return new Detective(this.location, this.id, this.color, this.taxiTickets);
  }
  /**
   * Set the Detective location to match the new node, and reduces the correct tickets, based on moveType
   * @param  {GraphNode|number} move
   * @param  {EdgeType} moveType
   */
  makeMove(move: GraphNode | number, moveType: EdgeType) {
    //Ignoring typechcks, because makeMove is injected to Player prototype afterwards
    //@ts-ignore
    super.makeMove(move, moveType);

    if (moveType === EdgeType.TAXI) {
      this.taxiTickets--;
    }
  }
}

export class MisterX extends Player implements Clonable<MisterX> {
  locationKnownToDetectives: GraphNode | null;
  turnCounterForLocation: number | null;

  constructor(
    location: GraphNode | null,
    id: number,
    color: Color,
    locationKnownToDetectives: GraphNode | null = null,
    turnCounterForLocation: number | null = null
  ) {
    super(Role.X, location, id, color);
    this.locationKnownToDetectives = locationKnownToDetectives;
    this.turnCounterForLocation = turnCounterForLocation;
  }

  /**
   * A copy of this player. Location is copied as a reference
   * @returns {MisterX}
   */
  clone(): MisterX {
    return new MisterX(
      this.location,
      this.id,
      this.color,
      this.locationKnownToDetectives,
      this.turnCounterForLocation
    );
  }
}

export enum Role {
  DETECTIVE = "DETECTIVE",
  X = "X",
}
