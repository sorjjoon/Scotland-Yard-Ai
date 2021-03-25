

import { gameMap } from ".";
import { EdgeType, GraphNode } from "../domain/graphnode";
import { Player} from "../domain/player";

//Adding prototypes here, so domain objects are not dependant on server (const gameMap)

declare module "../domain/player" {
    interface Player {
        makeMove(move: number | GraphNode, moveType: EdgeType)
        
    }
}

Player.prototype.makeMove = function makeMove(move: number | GraphNode, moveType: EdgeType) {
    if (!isNaN(Number(move))) {
      move = gameMap.getNode(Number(move));
    }
    this.location = move as GraphNode;
  }
