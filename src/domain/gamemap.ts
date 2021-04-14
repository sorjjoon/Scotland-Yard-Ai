import { EdgeType, GraphNode, NodeInfo } from "./GraphNode";

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
      node1.addEdge(node2, element.attributes.type);
      node2.addEdge(node1, element.attributes.type);
    });
  }
  /**
   * Create a gamemap from a json string (sigma export format)
   * @param  {string} mapJson
   */
  public static loadMap(mapJson: string) {
    console.debug("Loading graph data");
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
   * Return the node with the requested id
   * Returns null in case invalid id (like undefined)
   * @param  {number} nodeId
   * @returns {GraphNode}
   */
  public getNode(nodeId: number | string | null) {
    //Number(null) returns 0
    return this.nodes[Number(nodeId) - 1] ?? null;
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
  attributes: { [type: string]: EdgeType };
  color: string;
  size: number;
}
