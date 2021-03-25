import { cloneGameState, GameState } from "./gamestate";
import { gameDuration, revealTurns } from "../utils/constant";
import { Role } from "../domain/player";
import { EdgeType, GraphNode } from "../domain/graphnode";
import { lookUpBasedOnKey } from "../utils/utils";
import { gameMap } from "../server";

export class GameTree {
  static gameMap = gameMap;
  state: GameState;
  private children: GameTree[] | null;

  constructor(state: GameState) {
    this.state = state;
    this.children = null;
  }

  public getWinner(): string | null {
    if (
      this.state.detectives
        .map((d) => d.location.id)
        .includes(this.state.X.location.id)
    ) {
      return Role.DETECTIVE;
    }
    if (this.state.turnCounter == gameDuration) return Role.X;

    return null;
  }

  public getChildren(): GameTree[] {
    if (this.children !== null) {
      return this.children;
    }
    this.generateChildren();
    return this.children;
  }
  private generateChildren() {
    let player = this.state.playerToMove;
    let node = GameTree.gameMap.getNode(player.location.id);
  }
  /**
   * Construct a new game state, after the current player has made the specified move.
   * The originalState is not modified
   * @param  {GameState} originalState
   * @param  {GraphNode} move
   * @param  {EdgeType} moveType
   * @returns GameState
   */
  private static generateGameState(
    originalState: GameState,
    move: GraphNode,
    moveType: EdgeType
  ): GameState {
    var newState: GameState;
    newState = cloneGameState(originalState);

    if (newState.playerToMove.role === Role.X) {
      newState.turnCounter++;
      newState.X.location = move;
      newState.playerToMove = newState.detectives[0];
    } else {
      var oldPlayer = lookUpBasedOnKey(
        newState.detectives,
        "id",
        newState.playerToMove.id
      );
      oldPlayer.makeMove(move, moveType);
      //Detective Ids are consecutive 1,2,...detectiveCount, so indexing oldPLayer id will give the next detective in line.
      //X in case of last detective (and array index overflows)
      newState.playerToMove = newState.detectives[oldPlayer.id] ?? newState.X;
    }

    if (revealTurns.includes(newState.turnCounter)) {
      newState.X.locationKnownToDetectives = newState.X.location;
      newState.X.turnCounterForLocation = newState.turnCounter;
    }
    return newState;
  }
}
