import { EdgeType, GraphNode } from "../domain/GraphNode";
import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { maxDistanceBeforeRushing } from "../utils/constants";
import { lookUpBasedOnKey } from "../utils/utils";
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
  var possibleRoots: GameTree[] = [];

  //Determine possible roots, from X:s last known location
  if (Detective.isDetective(initialState.playerToMove)) {
    for (let xLoc of GameTree.findPossibleXLocations(initialState, initialState.X.movesSinceReveal)) {
      let state = GameTree.cloneGameState(initialState);
      state.X.location = xLoc;
      if (MisterX.isMisterX(state.playerToMove)) {
        state.playerToMove.location = xLoc;
      }
      possibleRoots.push(new treeConstructor(state));
    }
  } else {
    possibleRoots = [new treeConstructor(GameTree.cloneGameState(initialState))];
  }
  var fastestRoute;
  //Check if detective is far enough, so they should just rush X
  //Doesnt matter which member of roots we use, they only differ with X.location (cant use initialState)
  if (Detective.isDetective(possibleRoots[0].state.playerToMove)) {
    fastestRoute = GameTree.gameMap.findShortestPath(
      possibleRoots[0].state.X.locationKnownToDetectives.id,
      possibleRoots[0].state.playerToMove.location.id,
      possibleRoots[0].state.detectives.map((d) => d.id)
    );
    if (fastestRoute.length - 2 > maxDistanceBeforeRushing) {
      let rushMove = fastestRoute[1];

      rushMove.details.moveDebugStr = " No playouts, rushed towards X. Distance: {0}".formatString(
        fastestRoute.length - 2
      );
      for (let e of Object.values(EdgeType)) {
        if (
          fastestRoute[0]
            .getNeighbours(e)
            .map((e) => e.id)
            .includes(rushMove.id)
        ) {
          rushMove.details.moveType = e;
          break;
        }
      }
      //Make sure the move is legal, if it's not use playouts
      if (possibleRoots[0].state.playerToMove.tickets[rushMove.details.moveType] > 0) {
        return rushMove;
      }
    }
  }

  console.log("Starting playouts...");
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    for (let i = 0; i < 100; i++) {
      possibleRoots.forEach((r) => r.playout());
    }
  }
  const combinedRoots = new treeConstructor(possibleRoots[0].state);
  //Combine info from the used possible roots
  for (let i = 0; i < combinedRoots.getChildren().length; i++) {
    possibleRoots.forEach((r) => {
      combinedRoots.visits += r.visits;
      combinedRoots.wins += r.wins;
      combinedRoots.getChildren()[i].visits += r.getChildren()[i].visits;
      combinedRoots.getChildren()[i].wins += r.getChildren()[i].wins;
    });
  }
  console.log("Playouts finished!");

  let bestTree = combinedRoots.getBestMove();
  const temp = GameTree.getChosenMoveFromTree(combinedRoots, bestTree.state);
  let move = temp[0];
  let wp = bestTree.wins / bestTree.visits;
  if (MisterX.isMisterX(combinedRoots.state.playerToMove)) {
    wp = 1 - wp;
  }
  if (Detective.isDetective(initialState.playerToMove)) {
    move.details.moveDebugStr = " Playouts: {0}, using {2} possible root(s). Win ratio for chosen move: {1}. Fastest route towards X was  {3} (distance: {4})".formatString(
      combinedRoots.visits,
      wp.toFixed(2),
      possibleRoots.length,
      fastestRoute[1].id,
      fastestRoute.length
    );
  } else {
    move.details.moveDebugStr = " Playouts: {0}, using {2} possible root(s). Win ratio for chosen move: {1}.".formatString(
      combinedRoots.visits,
      wp.toFixed(2),
      possibleRoots.length
    );
  }
  move.details.moveType = temp[1];
  return move;
}
