import { GraphNode } from "../domain/GraphNode";
import { GameState } from "./GameState";
import { GameTree } from "./GameTree";

interface TreeConstructor {
  new (initial: GameState): GameTree;
}

/**
 * Construct a Monte Carlo Search Tree using the given consturctor, and do playouts on the created tree.
 *
 *
 * @param {GameState} initialState
 * @param {number} timeout timeout for playouts. The function will not return immediatly after timeout, as playouts are done in batches of 100 for performance
 * @param {TreeConstructor} treeConstructor Constructor used for creating a tree
 * @returns {GraphNode} Bets move, according to collected data
 */
export function monteCarloSearch(initialState: GameState, timeout: number, treeConstructor: TreeConstructor) {
  var root = new treeConstructor(initialState);
  console.log("Starting playouts...");
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    for (let i = 0; i < 100; i++) {
      root.playout();
    }
  }
  console.log("Playouts finished!");
  let bestTree = root.getBestMove();
  let move = GameTree.getChosenMoveFromTree(root, bestTree.state);
  move.details.moveDebugStr = " Playouts: {0}. Win ratio for chosen move: {1}".formatString(
    root.visits,
    (bestTree.wins / bestTree.visits).toFixed(2)
  );
  return move;
}
