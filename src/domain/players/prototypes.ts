import { EdgeType, GraphNode } from "../GraphNode";
import { Player } from "./Player";
import { gameMap } from "../../server/GameMap";

//Adding prototypes here, so domain objects are not dependant on server (const gameMap)

declare module "../../domain/players/Player" {
  interface Player {
    makeMove(move: number | GraphNode, moveType: EdgeType);
  }
}
/**
 * Set the players position to match the new node.
 * Node can be GraphNode object or a node id (in which the correct node is looked up from gamemap)
 * @param  {number|GraphNode} move
 * @param  {EdgeType} moveType
 */
Player.prototype.makeMove = function makeMove(newNode: number | GraphNode, moveType: EdgeType) {
  if (typeof newNode === "number") {
    newNode = gameMap.getNode(newNode);
  }
  this.location = newNode;
  this.tickets[moveType]--;
};
