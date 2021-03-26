export class GraphNode {
  readonly id: number;
  private taxiEdges: Array<GraphNode>;
  
  /**
   * GraphNode from stringified sigma node
   * @param  {NodeInfo} nodeInfo
   */
  constructor(nodeInfo: NodeInfo) {
    this.id = parseInt(nodeInfo.id);
    this.taxiEdges = [];
  }
  /**
   * Get all neighboring nodes of the given type. 
   * Do not modify the returned array, if you need to add a new edge, use addEdge
   * @param  {EdgeType} type Edgetypes to return. Currently only Taxi is supported
   * @returns {readonly GraphNode[]} readonly GraphNode
   */
   getNeighbours(type: EdgeType): readonly GraphNode[] {
    if (type === EdgeType.TAXI) {
      return this.taxiEdges;
    } else {
      throw Error("not supported");
    }
  }
  /**
   * Add a new neighbour to this node
   * @param  {GraphNode} node
   */
   addEdge(node: GraphNode) {
    this.taxiEdges.push(node);
    this.taxiEdges.sort((a: GraphNode, b: GraphNode): number => {
      return a.id - b.id;
    });
  }
  /**
   * Type guard for GraphNode objects. Will return true in case GraphNode objects, or stringified sigma nodes
   * @param  {any} node
   * @returns nodeisGraphNode
   */
  static isGraphNode(node:any):node is GraphNode {
    return node instanceof GraphNode ||(node.id !== undefined && node.label !== undefined && node.x !== undefined && node.y !== undefined)
  }
}
export enum EdgeType {
  TAXI = "TAXI",
}
/**
 * Sigma exported node (so a node that has been stringified)
 */
export interface NodeInfo {
  label: string;
  x: number;
  y: number;
  id: string;
  attributes: object;
  color: string;
  size: number;
}
