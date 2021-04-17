import { SerializedPlayer } from "./SerializedPlayer";
import { Color } from "../../utils/constants";
import { Clonable } from "../Clonable";
import { EdgeType, GraphNode } from "../GraphNode";
import { Player, Role } from "./Player";

export class MisterX extends Player implements Clonable<MisterX> {
  locationKnownToDetectives: GraphNode | null;
  turnCounterForLocation: number | null;
  movesSinceReveal: EdgeType[];

  constructor(
    location: GraphNode | null,
    id: number,
    color: Color,
    locationKnownToDetectives: GraphNode | null = null,
    turnCounterForLocation: number | null = null,
    movesSinceReveal = []
  ) {
    const tickets = {};
    for (let key of Object.values(EdgeType)) {
      tickets[key] = Number.MAX_SAFE_INTEGER;
    }
    super(Role.X, location, id, color, tickets);

    this.locationKnownToDetectives = locationKnownToDetectives;
    this.turnCounterForLocation = turnCounterForLocation;
    this.movesSinceReveal = movesSinceReveal;
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
      this.turnCounterForLocation,
      this.movesSinceReveal.map((x) => x)
    );
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
   *
   * @param  {Player|SerializedPlayer} player
   * @returns {boolean} true if the given player's role is X
   */
  static isMisterX(p: Player | SerializedPlayer): p is MisterX {
    return p.role === Role.X;
  }
}
