

import { gameMap } from ".";
import { EdgeType, GraphNode } from "../domain/graphnode";
import { Player} from "../domain/player";

//Adding prototypes here, so domain objects are not dependant on server (const gameMap)

declare module "../domain/player" {
    interface Player {
        makeMove(move: number | GraphNode, moveType: EdgeType)
        
    }
}
/**
 * Set the players position to match the new node.
 * Node can be GraphNode object or a node id (in which the correct node is looked up from gamemap)
 * @param  {number|GraphNode} move
 * @param  {EdgeType} moveType
 */
Player.prototype.makeMove = function makeMove(newNode: number | GraphNode, moveType: EdgeType) {
    if (!isNaN(Number(newNode))) {
      newNode = gameMap.getNode(Number(newNode));
    }
    this.location = newNode as GraphNode;
  }
