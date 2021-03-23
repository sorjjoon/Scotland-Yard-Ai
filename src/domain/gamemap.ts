import { GraphNode, NodeInfo } from "./graphnode";

export class GameMap {
  private nodes: Array<GraphNode>;

  constructor(nodes: Array<NodeInfo>, edges: Array<EdgeInfo>) {
    this.nodes = [];
    nodes.forEach((element) => {
      this.nodes.push(new GraphNode(element));
    });

    this.nodes.sort((a: GraphNode, b: GraphNode): number => {
      return a.id - b.id;
    });

    edges.forEach((element) => {
      let node1 = this.getNode(element.source);
      let node2 = this.getNode(element.target);
      if (element.color == "rgb(0,0,0)") {
        node1.addEdge(node2);
        node2.addEdge(node1);
      }
    });
  }

  static loadMap(mapJson: string) {
    console.log("Loading graph data");
    const data: MapData = JSON.parse(mapJson);
    return new GameMap(data.nodes, data.edges);
  }
  getAllNodes(): readonly GraphNode[] {
    return this.nodes;
  }
  getNode(nodeId: number) {
    return this.nodes[nodeId - 1];
  }
}

interface MapData {
  nodes: Array<NodeInfo>;
  edges: Array<EdgeInfo>;
}

interface EdgeInfo {
  source: number;
  target: number;
  id: number;
  attributes: object;
  color: string;
  size: number;
}
