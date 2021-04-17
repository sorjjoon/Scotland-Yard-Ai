import { Color } from "../../utils/constants";
import { Clonable } from "../Clonable";
import { EdgeType, GraphNode, NodeInfo } from "../GraphNode";

export abstract class Player implements Clonable<Player> {
  readonly role: Role;
  readonly id: number;
  location: GraphNode | null;
  color: Color;
  tickets: { [key in EdgeType]?: number };
  isPlayedByAI?: boolean;
  aiType?: string;

  constructor(
    role: Role,
    location: GraphNode | null,
    id: number,
    color: Color,
    tickets: { [key in EdgeType]?: number }
  ) {
    this.role = role;
    this.location = location;
    this.id = id;
    this.color = color;
    this.tickets = {};
    for (let key in EdgeType) {
      this.tickets[key] = tickets[key] ?? 0;
    }
  }

  /**
   * Returns a deep copy of the player
   * location is a shallow copy
   * @returns Player
   */
  clone(): Player {
    throw Error("Not implemented");
  }
  /**
   * Set the players position to match the new node.
   * Node can be GraphNode object or a node id (in which the correct node is looked up from gamemap)
   * @param  {number|GraphNode} move
   * @param  {EdgeType} moveType
   */
  makeMove(move: GraphNode | number, moveType: EdgeType) {
    throw Error("makeMove was not overriden, remember to load players/prototypes");
  }

  /**
   * Compare an object to this player
   * Return true in case other is an object with a matching color, id, role and location id
   * @param  {any} other
   * @returns {boolean}
   */
  equalTo(other: any) {
    if (other.tickets == null) {
      return false;
    }
    for (let key in this.tickets) {
      if (this.tickets[key] != other.tickets[key]) {
        return false;
      }
    }
    return (
      this.color === other.color &&
      this.id === other.id &&
      this.role === other.role &&
      parseInt(this.location.id as any) === parseInt(other.location.id)
    );
  }
}

export enum Role {
  DETECTIVE = "DETECTIVE",
  X = "X",
}
