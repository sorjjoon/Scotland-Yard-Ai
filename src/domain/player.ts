import { Color } from "../utils/constant";
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

export class Detective extends Player implements Clonable<Detective>{
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
  clone() {
    return new Detective(this.location, this.id, this.color, this.taxiTickets)
  }

  makeMove(move: GraphNode | number, moveType: EdgeType) {
    //@ts-ignore
    super.makeMove(move, moveType);
    
    if (moveType === EdgeType.TAXI) {
      this.taxiTickets--;
    }
  }
}

export class MisterX extends Player implements Clonable<MisterX>{
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

  clone() {
    return new MisterX(this.location, this.id, this.color, this.locationKnownToDetectives, this.turnCounterForLocation)
  }
}

export enum Role {
  DETECTIVE = "DETECTIVE",
  X = "X",
}
