export class GraphNode {
  id: number;
  protected taxiEdges: Array<GraphNode>;

  constructor(nodeInfo: NodeInfo) {
    this.id = parseInt(nodeInfo.id);
    this.taxiEdges = [];
  }

  getNeighbours(type: EdgeType): readonly GraphNode[] {
    if (type === EdgeType.TAXI) {
      return this.taxiEdges;
    } else {
      throw Error("not supported");
    }
  }

  addEdge(node: GraphNode) {
    this.taxiEdges.push(node);
    this.taxiEdges.sort((a: GraphNode, b: GraphNode): number => {
      return a.id - b.id;
    });
  }
}
export enum EdgeType {
  TAXI = "TAXI",
}

export interface NodeInfo {
  label: string;
  x: number;
  y: number;
  id: string;
  attributes: object;
  color: string;
  size: number;
}
