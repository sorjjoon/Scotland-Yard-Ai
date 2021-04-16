/**
 * Sigma exported node (so a node that has been stringified)
 */
export interface NodeInfo {
  label?: string;
  x?: number;
  y?: number;
  id?: string | number;
  attributes?: object;
  color?: string;
  size?: number;

  //Not normally part of sigma nodes,
  moveDebugStr?: string;
  moveType?: EdgeType;
}
/**
 * Sigma exported edge
 */
export interface EdgeInfo {
  source: number;
  target: number;
  id: number;
  attributes: { [type: string]: EdgeType };
  color: string;
  size: number;
}

export class GraphNode {
  readonly id: number;
  private edges: { [key in EdgeType]?: Array<GraphNode> };
  readonly details: NodeInfo;
  /**
   * GraphNode from stringified sigma node
   * @param  {NodeInfo} nodeInfo
   */
  constructor(nodeInfo: NodeInfo) {
    this.id = Number(nodeInfo.id);
    this.edges = {};
    for (let key in EdgeType) {
      this.edges[key] = [];
    }
    this.details = nodeInfo;
  }
  /**
   * Get all neighboring nodes of the given type.
   * Do not modify the returned array, if you need to add a new edge, use addEdge
   * @param  {EdgeType} type Edgetype to return.
   * @returns {readonly GraphNode[]} readonly GraphNode
   */
  getNeighbours(type: EdgeType): readonly GraphNode[] {
    return this.edges[type];
  }

  /**
   * Get all neighboring nodes of the given types.
   * Do not modify the returned array, if you need to add a new edge, use addEdge
   * @param  {EdgeType} type Edgetypes to return.
   * @returns {readonly GraphNode[]} readonly GraphNode
   */
  getAllNeighbours(types: EdgeType[]): readonly GraphNode[] {
    const res = [];
    for (let t of types) {
      res.push(...this.edges[t]);
    }
    return res;
  }
  /**
   * Add a new neighbour to this node
   * @param  {GraphNode} node
   */
  addEdge(node: GraphNode, type: EdgeType) {
    this.edges[type].push(node);
    this.edges[type].sort((a: GraphNode, b: GraphNode): number => {
      return a.id - b.id;
    });
  }
  toString() {
    return "id: " + this.id;
  }
  /**
   * Type guard for GraphNode objects. Will return true in case GraphNode objects, or stringified sigma nodes
   * @param  {any} node
   * @returns {boolean}
   */
  static isGraphNode(node: any): node is GraphNode {
    return (
      node instanceof GraphNode ||
      (node.id !== undefined && node.label !== undefined && node.x !== undefined && node.y !== undefined)
    );
  }
}
export enum EdgeType {
  TAXI = "TAXI",
  BUS = "BUS",
  METRO = "METRO",
}
