import { GraphNode, NodeInfo } from "./graphnode";

export class GameMap {
  private nodes: Array<GraphNode>;
  /**
   * use the function 'loadMap' for instating a map from json
   * @param  {Array<NodeInfo>} nodes
   * @param  {Array<EdgeInfo>} edges
   */
  private constructor(nodes: Array<NodeInfo>, edges: Array<EdgeInfo>) {
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
  /**
   * Create a gamemap from a json string (sigma export format)
   * @param  {string} mapJson
   */
  public static loadMap(mapJson: string) {
    console.log("Loading graph data");
    const data: MapData = JSON.parse(mapJson);
    return new GameMap(data.nodes, data.edges);
  }
  /**
   * Nodes are ordered by id
   * @returns GraphNode[] 
   */
  public getAllNodes(): readonly GraphNode[] {
    return this.nodes;
  }
  /**
   * @param  {number} nodeId
   */
  public getNode(nodeId: number|string) {
    return this.nodes[Number(nodeId) - 1];
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
