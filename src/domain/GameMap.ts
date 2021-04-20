import { EdgeInfo, EdgeType, GraphNode, NodeInfo } from "./GraphNode";
import { Queue } from "./Queue";

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
   * @returns {GraphNode[]}
   */
  public getAllNodes(): readonly GraphNode[] {
    return this.nodes;
  }
  /**
   * Return the node with the requested id
   *
   * Returns null in case invalid id (like undefined)
   * @param  {number} nodeId
   * @returns {GraphNode}
   */
  public getNode(nodeId: number | string | null) {
    //Number(null) returns 0
    return this.nodes[Number(nodeId) - 1] ?? null;
  }
  /**
   * Find the shortest route between two nodes
   *
   * The route will always have the end start nodes included ( distance = route.length-2)
   *
   * Will use all edgetypes available
   * @param  {GraphNode|number} start
   * @param  {GraphNode|number} end
   * @param  {number[]} avoidNodes ids of nodes which can not be visisted FROM STARTING NODE
   * @returns {GraphNode[]}
   */
  public findShortestPath(
    start: GraphNode | number,
    end: GraphNode | number,
    avoidNodeIds: number[] = []
  ): GraphNode[] {
    if (typeof start == "number") {
      start = this.getNode(start);
    }
    if (typeof end == "number") {
      end = this.getNode(end);
    }
    const queue = new Queue<GraphNode[]>();

    const seen = Array(this.nodes.length);
    seen.fill(false);
    //First iteration has to use avoidNodes
    for (let n of start.getAllNeighbours(Object.values(EdgeType))) {
      if (!avoidNodeIds.includes(n.id)) {
        queue.push([start, n]);
      }
    }

    while (!queue.isEmpty()) {
      let route = queue.pop();
      let current = route[route.length - 1];
      if (seen[current.id - 1]) continue;
      seen[current.id - 1] = true;
      if (current.id == end.id) {
        return route;
      }
      for (let n of current.getAllNeighbours(Object.values(EdgeType))) {
        if (!seen[n.id - 1]) {
          queue.push(route.concat(n));
        }
      }
    }
    throw Error("Invalid end and avoidNodes");
  }
}

interface MapData {
  nodes: Array<NodeInfo>;
  edges: Array<EdgeInfo>;
}
