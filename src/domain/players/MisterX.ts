import { SerializedPlayer } from "./SerializedPlayer";
import { Color } from "../../utils/constants";
import { Clonable } from "../clonable";
import { EdgeType, GraphNode } from "../graphnode";
import { Player, Role } from "./Player";

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
    return new MisterX(this.location, this.id, this.color, this.locationKnownToDetectives, this.turnCounterForLocation);
  }

  makeMove(move: GraphNode | number, moveType: EdgeType) {
    super.makeMove(move, moveType);
  }
  equalTo(other: any) {
    return (
      super.equalTo(other) &&
      ((this.turnCounterForLocation === other.turnCounterForLocation &&
        Number(this.locationKnownToDetectives?.id) === Number(other.locationKnownToDetectives?.id)) ||
        this.locationKnownToDetectives?.id == other.locationKnownToDetectives?.id) &&
      this.turnCounterForLocation == other.turnCounterForLocation
    );
  }
  /**
   * Type guard for MisterX
   * Returns true if the given player's role is X
   * @param  {Player|SerializedPlayer} p
   * @returns {boolean}
   */
  static isMisterX(p: Player | SerializedPlayer): p is MisterX {
    return p.role === Role.X;
  }
}
