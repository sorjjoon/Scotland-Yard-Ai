import { NodeInfo, GraphNode } from "../GraphNode";
import { Role } from "./Player";
import { Color } from "../../utils/constants";

export interface SerializedPlayer {
  role: Role;
  location: NodeInfo | null;
  id: number;
  color: Color;
  taxiTickets?: number;
  locationKnownToDetectives?: GraphNode | null;
  turnCounterForLocation?: number | null;
}
