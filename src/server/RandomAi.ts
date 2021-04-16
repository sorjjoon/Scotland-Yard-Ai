import { GraphNode } from "../domain/GraphNode";
import { GameState } from "../MCST/GameState";
import { GameTree } from "../MCST/GameTree";

export function randomMove(initialState: GameState): GraphNode {
  const tree = new GameTree(initialState);
  const child = tree.getChildren().getRandom();
  const temp = GameTree.getChosenMoveFromTree(tree, child.state);
  let move = temp[0];
  move.details.moveType = temp[1];
  return move;
}
