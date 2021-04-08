import { GameState } from "./GameState";
import { gameDuration, revealTurns } from "../utils/constants";
import { Role } from "../domain/players/Player";
import { EdgeType, GraphNode } from "../domain/GraphNode";
import { lookUpBasedOnKey } from "../utils/utils";
import { gameMap } from "../server/GameMap";
import { MisterX } from "../domain/players/MisterX";
import { Detective } from "../domain/players/Detective";
import { createPlayerFromObject } from "../server/utils";

//Load prototypes
require("../domain/players/prototypes");
require("../utils/prototypes");

/**
 * Base class for all MCST search trees.
 */
export class GameTree {
  static gameMap = gameMap;
  state: GameState;
  protected children: GameTree[] | null;
  wins: number;
  visits: number;

  /**
   * Passed state properties must be proper Domain objects (not parsed from JSON)
   * Pass the state to cloneGameState first otherwise
   * @param  {GameState} state
   */
  constructor(state: GameState) {
    this.state = state;
    this.children = null;
    this.wins = 0;
    this.visits = 0;
  }

  /**
   * Check if this state is an end state or not
   * Returns null if no side is the winner
   * @returns {string| null}
   */
  public getWinner(): string | null {
    if (this.state.detectives.map((d) => d.location.id).includes(this.state.X.location.id)) {
      return Role.DETECTIVE;
    }
    if (this.state.turnCounter >= gameDuration) return Role.X;
    return null;
  }
  /**
   * Find all possible game states from this position in one move
   * @returns { readonly GameTree[]} children
   */
  public getChildren(): readonly GameTree[] {
    if (this.children == null) {
      this.children = this.generateChildren();
    }
    return this.children;
  }

  /**
   * Complete a single playout for this gametree.
   */
  public playout() {
    this.selection();
  }
  /**
   * Find the optimal move for the current player to move, according to current playout data
   * @returns {GraphNode}
   */
  public getBestMove(): GameTree {
    throw Error("not implemented");
  }
  /**
   * Selection part of the MCTS search.
   * Go through already visited child nodes, until we find a node we haven't visited before
   */
  protected selection() {
    throw Error("not implemented");
  }
  /**
   * Pick random children, until an endstate is reached
   * Returns true if x won this playout
   * @returns {boolean} Xwins
   */
  protected rollout() {
    var XWins;
    switch (this.getWinner()) {
      case Role.DETECTIVE:
        XWins = false;
        break;
      case Role.X:
        XWins = true;
        break;
      default:
        XWins = this.getChildren().getRandom().rollout();
    }
    return this.propogate(XWins);
  }
  /**
   * Update the visits and wins, according to who won this playout, for the player currently to move
   * @param  {boolean} XWon
   * @returns {boolean} Xwins
   */
  protected propogate(XWon: boolean) {
    this.visits++;
    if (XWon && MisterX.isMisterX(this.state.playerToMove)) {
      this.wins++;
    }
    if (!XWon && Detective.isDetective(this.state.playerToMove)) {
      this.wins++;
    }
    return XWon;
  }

  /**
   * Check if this node a leaf or not (end state, or a state with unvisited child states).
   * @returns {boolean}
   */
  protected isLeaf() {
    if (this.getWinner() !== null) {
      return true;
    }
    return this.getChildren()
      .map((x) => x.visits)
      .includes(0);
  }
  /**
   * Generate all possible child states reachable from this state.
   * If called by a derived class, will use the overloaded constructor instead of the GameTree one (and children will not be typeof GameTree)
   * @returns {GameTree}
   */
  protected generateChildren() {
    let player = this.state.playerToMove;
    //Empty object set by client script as player to move for states after one side won
    if (Object.keys(player).length === 0) {
      return [];
    }
    let playerNode = GameTree.gameMap.getNode(player.location.id);
    const detectiveNodes = this.state.detectives.map((d) => d.location.id);
    const children = [];
    playerNode.getNeighbours(EdgeType.TAXI).forEach((node) => {
      //Detectives are not allowed to go on to a node with another detective, but mister X is (in case X is surrounded, only move)
      if (!detectiveNodes.includes(node.id) || this.state.playerToMove.role == Role.X) {
        let stateAfterMove = GameTree.generateGameState(this.state, node, EdgeType.TAXI);
        //Will use overloaded construcor, instead of GameTree if called by derived class. ts-ignore to avoid ts complaining about new keyword
        //@ts-ignore}
        children.push(new this.constructor(stateAfterMove));
      }
    });
    return children;
  }
  /**
   * Construct a new game state, after the current player has made the specified move.
   * The originalState is not modified
   * @param  {GameState} originalState
   * @param  {GraphNode} move
   * @param  {EdgeType} moveType
   * @returns GameState
   */
  protected static generateGameState(originalState: GameState, move: GraphNode, moveType: EdgeType): GameState {
    var newState = GameTree.cloneGameState(originalState);
    if (MisterX.isMisterX(newState.playerToMove)) {
      newState.turnCounter++;
      newState.X.makeMove(move, moveType);
      newState.playerToMove = newState.detectives[0];
    } else {
      var oldPlayer = lookUpBasedOnKey(newState.detectives, "id", newState.playerToMove.id);
      oldPlayer.makeMove(move, moveType);
      //Detective Ids are consecutive 1,2,...,detectiveCount, so indexing oldPLayer id will give the next detective in line.
      //X in case of last detective (and array index overflows)
      newState.playerToMove = newState.detectives[oldPlayer.id] ?? newState.X;
    }

    if (revealTurns.includes(newState.turnCounter)) {
      newState.X.locationKnownToDetectives = newState.X.location;
      newState.X.turnCounterForLocation = newState.turnCounter;
    }
    return newState;
  }
  /**
   * Return a clone of the given state.
   * Players are cloned using .clone
   * The new state will be constructed using GraphNode and Player objects (even if the old state is not)
   * Also strips unnecessary attributes
   * @param  {GameState} state
   * @returns {GameState}
   */
  public static cloneGameState(state: GameState): GameState {
    try {
      return {
        detectives: state.detectives.map((d) => d.clone()),
        X: state.X.clone(),
        turnCounter: state.turnCounter,
        playerToMove: state.playerToMove.clone(),
      };
      //Duck typing in case we are passed an Unknown Player
    } catch (error) {
      return {
        detectives: state.detectives.map((d) => (createPlayerFromObject(d) as Detective).clone()),
        X: (createPlayerFromObject(state.X) as MisterX).clone(),
        turnCounter: state.turnCounter,
        playerToMove: createPlayerFromObject(state.playerToMove).clone(),
      };
    }
  }
  /**
   * Returns the child from the inital game tree which matches the new state
   * Checks that the provided moves are correct (contained in d1Moves if detective 1 moved etc.)
   * Returns null in case the provided move was not found (check the result for null)
   * @param  {GameTree} inital
   * @param  {GameState} newState
   * @returns GameTree
   */
  public static getChosenMoveFromTree(inital: GameTree, newState: GameState): GraphNode {
    var moveId;
    if (MisterX.isMisterX(inital.state.playerToMove)) {
      moveId = newState.X.location.id;
    } else {
      moveId = lookUpBasedOnKey(newState.detectives, "id", inital.state.playerToMove.id).location.id;
    }
    return GameTree.gameMap.getNode(moveId);
  }
}
