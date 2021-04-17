import { SerializedPlayer } from "./SerializedPlayer";
import { Color } from "../../utils/constants";
import { Clonable } from "../Clonable";
import { EdgeType, GraphNode } from "../GraphNode";
import { Player, Role } from "./Player";

export class Detective extends Player implements Clonable<Detective> {
  //This attribute is here to make sure Detective is not structually similar to Player (and will not be automatically cast to a Player)
  readonly uselessAttribute: undefined;
  /**
   * Create a new Detective.
   *
   * Tickets is copied by value to the new Detective. Keys in tickets which are not EdgeTypes are ignored
   *
   * @param  {GraphNode|null} location
   * @param  {number} id
   * @param  {Color} color
   * @param  {{[keyinEdgeType]?:number}} tickets
   */
  constructor(location: GraphNode | null, id: number, color: Color, tickets: { [key in EdgeType]?: number }) {
    super(Role.DETECTIVE, location, id, color, tickets);
  }
  /**
   * A copy of this detective. Location is copied as a reference
   * @returns {Detective}
   */
  clone(): Detective {
    return new Detective(this.location, this.id, this.color, this.tickets);
  }

  /**
   * Type guard for Detective
   *
   * @param  {Player|SerializedPlayer} player
   * @returns {boolean} true if the given player's role is DETECTIVE
   */
  static isDetective(p: Player | SerializedPlayer): p is Detective {
    return p.role === Role.DETECTIVE;
  }
}
