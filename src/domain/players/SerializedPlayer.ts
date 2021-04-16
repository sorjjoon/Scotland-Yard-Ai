import { NodeInfo, GraphNode, EdgeType } from "../GraphNode";
import { Role } from "./Player";
import { Color } from "../../utils/constants";

export interface SerializedPlayer {
  role: Role;
  location: NodeInfo | null;
  id: number;
  color: Color;
  tickets?: { [key in EdgeType]?: number };
  locationKnownToDetectives?: GraphNode | null;
  turnCounterForLocation?: number | null;
  movesSinceReveal?: EdgeType[];
}
