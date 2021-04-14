import { SerializedPlayer } from "./SerializedPlayer";
import { Color } from "../../utils/constants";
import { Clonable } from "../clonable";
import { EdgeType, GraphNode } from "../GraphNode";
import { Player, Role } from "./Player";

export class Detective extends Player implements Clonable<Detective> {
  taxiTickets: number;
  tickets: { [key in EdgeType]?: number };

  constructor(location: GraphNode | null, id: number, color: Color, taxiTickets: number) {
    super(Role.DETECTIVE, location, id, color);
    this.tickets.TAXI = taxiTickets;
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
   * Makes no effort to check, if the provided move is a valid move
   * @param  {GraphNode|number} move
   * @param  {EdgeType} moveType
   */
  makeMove(move: GraphNode | number, moveType: EdgeType) {
    super.makeMove(move, moveType);
    if (moveType === EdgeType.TAXI) {
      this.taxiTickets--;
    }
  }
  equalTo(other: any) {
    return super.equalTo(other) && this.taxiTickets === other.taxiTickets;
  }
  /**
   * Type guard for Detective
   * Returns true if the given player's role is DETECTIVE
   * @param  {Player|SerializedPlayer} p
   * @returns {boolean}
   */
  static isDetective(p: Player | SerializedPlayer): p is Detective {
    return p.role === Role.DETECTIVE;
  }
}
