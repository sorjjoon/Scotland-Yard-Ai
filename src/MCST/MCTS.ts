import { EdgeType, GraphNode } from "../domain/GraphNode";
import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { maxDistanceBeforeRushing } from "../utils/constants";
import { lookUpBasedOnKey } from "../utils/utils";
import { GameState } from "./GameState";
import { GameTree } from "./GameTree";
import { ExplorativeSearchTree } from "./search_trees/ExplorativeSearchTree";
import { PureSearchTree } from "./search_trees/PureSearchTree";

interface TreeConstructor {
  new (initial: GameState, explorationParam?): GameTree;
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
export function monteCarloSearch(initialState: GameState, timeout: number, treeConstructor: TreeConstructor, explorationParam?:number) {
  var possibleRoots: GameTree[] = [];
  const debugStrArgs: any = { initialState: initialState };
  //Determine possible roots, from X:s last known location
  if (Detective.isDetective(initialState.playerToMove)) {
    for (let xLoc of GameTree.findPossibleXLocations(initialState, initialState.X.movesSinceReveal)) {
      let state = GameTree.cloneGameState(initialState);
      state.X.location = xLoc;
      if (MisterX.isMisterX(state.playerToMove)) {
        state.playerToMove.location = xLoc;
      }
      possibleRoots.push(new treeConstructor(state, explorationParam));
    }
  } else {
    possibleRoots = [new treeConstructor(GameTree.cloneGameState(initialState), explorationParam)];
  }
  debugStrArgs.possibleRoots = possibleRoots;
  var fastestRoute;
  //Check if detective is far enough, so they should just rush X
  //Doesnt matter which member of roots we use, they only differ with X.location (cant use initialState)
  if (Detective.isDetective(possibleRoots[0].state.playerToMove)) {
    fastestRoute = GameTree.gameMap.findShortestPath(
      possibleRoots[0].state.X.locationKnownToDetectives.id,
      possibleRoots[0].state.playerToMove.location.id,
      possibleRoots[0].state.detectives.map((d) => d.id)
    );
    debugStrArgs.fastestRoute = fastestRoute;
    if (fastestRoute.length - 2 > maxDistanceBeforeRushing) {
      let rushMove = fastestRoute[fastestRoute.length - 2];

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
  debugStrArgs.combinedRoots = combinedRoots;

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
  debugStrArgs.bestTree = bestTree;

  let bestMove = temp[0];

  bestMove.details.moveDebugStr = getDebugStr(debugStrArgs);

  bestMove.details.moveType = temp[1];
  return bestMove;
}

function getDebugStr(args: {
  combinedRoots: GameTree;
  bestTree: GameTree;
  possibleRoots;
  fastestRoute;
  initialState: GameState;
}): string {
  var str = " Playouts: {0}, using {1} possible root(s).".formatString(
    args.combinedRoots.visits,
    args.possibleRoots.length
  );
  if (Detective.isDetective(args.initialState.playerToMove)) {
    str += " Fastest route towards X was  {0} (distance: {1})".formatString(
      args.fastestRoute[args.fastestRoute.length - 2]?.id ?? args.fastestRoute[args.fastestRoute.length - 1]?.id,
      args.fastestRoute.length
    );
  }
  switch (args.bestTree.constructor) {
    case PureSearchTree:
      let winPre = args.bestTree.wins / args.bestTree.visits;
      if (MisterX.isMisterX(args.combinedRoots.state.playerToMove)) {
        winPre = 1 - winPre;
      }
      str += " Win ratio for chosen move: " + winPre.toFixed(2);

      break;
    case ExplorativeSearchTree:
      str += " Visits for children (largest chosen) [{0}]".formatString(
        args.combinedRoots
          .getChildren()
          .map((a) => a.visits)
          .join(", ")
      );
      break;
    default:
      break;
  }
  return str;
}
