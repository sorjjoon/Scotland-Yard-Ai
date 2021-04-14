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

  //Not normally part of sigma nodes, added to give info to the user about playout count
  moveDebugStr?: string;
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
   * @param  {EdgeType} type Edgetypes to return.
   * @returns {readonly GraphNode[]} readonly GraphNode
   */
  getNeighbours(type: EdgeType): readonly GraphNode[] {
    return this.edges[type];
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
