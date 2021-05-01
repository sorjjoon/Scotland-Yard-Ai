import { addToSidebar, lookupNodeById, setNodeColor } from "./utils";
import { Player } from "../domain/players/Player";
import { EdgeInfo, EdgeType, GraphNode, NodeInfo } from "../domain/GraphNode";
import { black } from "../utils/constants";
import { pushGameState } from "./replay";
import { GameState } from "../MCST/GameState";
import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";

/**
 * Entry point for a new game
 */
export async function mainLoop() {
  let turnCounter = 0;
  const detectives = window.detectives;
  const X = window.X;
  pushGameState(0, X);
  while (turnCounter <= 23 && !xIsCaught()) {
    turnCounter++;

    setNodeColor(X.location.id, black);
    addToSidebar("<b>Turn {0}</b>".formatString(turnCounter));
    //X move
    if (!X.isPlayedByAI) {
      addToSidebar("<span style='color:{0};'>X turn! Current location:{1}</span>".formatString(X.color, X.location.id));
      X.location = await getNextMove(X);
      setNodeColor(X.location.id, X.color);
    } else {
      addToSidebar("<span style='color:{0};'>X turn!</span>".formatString(X.color));
      X.location = await getMoveFromServer(getGameState(turnCounter, X));
    }
    if (window.revealTurns.includes(turnCounter)) {
      addToSidebar(
        "<span style='color:{0};'>X</span> is revealed to the detectives! His location is {1}".formatString(
          X.color,
          X.location.id
        )
      );
      X.locationKnownToDetectives = X.location;
      X.turnCounterForLocation = turnCounter;
      X.movesSinceReveal = [];
      setNodeColor(X.location.id, X.color);
    } else {
      addToSidebar("X moved in secret, using {0}".formatString(X.location.details.moveType));
      X.movesSinceReveal.push(X.location.details.moveType);
      setNodeColor(X.location.id, black);
    }
    if (xIsCaught()) {
      break;
    }
    pushGameState(turnCounter, detectives[0]);
    for (const [i, p] of detectives.entries()) {
      addToSidebar(
        "<span style='color:{0};'>Detective {1} turn! Current location:{2}</span>".formatString(
          p.color,
          p.id,
          p.location.id
        )
      );
      setNodeColor(p.location.id, black);

      if (!p.isPlayedByAI) {
        if (!checkIfAnyValidMoves(p)) {
          addToSidebar("No valid moves remaining");
          p.location.details.moveType = undefined;
        } else {
          p.location = await getNextMove(p);
        }
      } else {
        p.location = await getMoveFromServer(getGameState(turnCounter, p));
      }
      setNodeColor(p.location.id, p.color);
      addToSidebar(
        "<span style='color:{0};'>Detective {1} moved to: {2}, using {3}</span>".formatString(
          p.color,
          p.id,
          p.location.id,
          p.location.details.moveType ?? "NO TICKETS"
        )
      );
      if (p.location.details.moveType) {
        p.tickets[p.location.details.moveType]--;
      }
      addToSidebar(
        "<span style='color:{0};'>Tickets remaining: {1} </span>".formatString(p.color, JSON.stringify(p.tickets))
      );
      pushGameState(turnCounter, detectives[i + 1] ?? X);
      if (xIsCaught()) {
        break;
      }
    }
  }
  if (xIsCaught()) addToSidebar("<b>X was caught! Detectives win!</b>");
  else addToSidebar("<b>Time ran out! X won!</b>");
  addToSidebar("Refresh view for a new game");
  pushGameState(turnCounter, {} as any);
  addToSidebar("<button id='replay-button' onclick='lib.replayGame()'> Replay Game </button>");
  return xIsCaught();
}
/**
 * Wait for a human player to make a move, and check that the made move is legal
 *
 * @param  {Player} player
 * @returns {Promise<GraphNode>} move
 */
function getNextMove(player: Player): Promise<GraphNode> {
  delete window.clickedNode;
  window.gameActive = true;
  const intervalId = setInterval(function () {
    let node = lookupNodeById(player.location.id);
    if (node.color === black && window.gameActive) {
      node.color = player.color;
    } else {
      node.color = black;
    }
    window._sigma.refresh();
  }, 1000);
  addToSidebar("Choose the new node to move to");
  return new Promise(function (resolve, reject) {
    (function waitForInput() {
      if ("clickedNode" in window) {
        window.gameActive = false;
        let move = window.clickedNode;
        delete window.clickedNode;
        for (let edge in EdgeType) {
          let showEdge = (document.getElementById(edge.toLocaleLowerCase()) as HTMLInputElement).checked;
          if (showEdge && validMove(player, move.id, edge as EdgeType)) {
            clearInterval(intervalId);
            setNodeColor(player.location.id, black);
            let temp = new GraphNode(move);
            temp.details.moveType = edge as EdgeType;
            return resolve(temp);
          }
        }
        window.gameActive = true;
        addToSidebar("Illegal move, choose again");
      }
      setTimeout(waitForInput, 50);
    })();
  });
}
/**
 * Check if the given move is legal for the given player
 * @param  {Player} player
 * @param  {number|string} move
 * @returns {boolean}
 */
function validMove(player: Player, move: number | string, moveType: EdgeType): boolean {
  let neighbours: NodeInfo[] = (window._sigma.graph as any).adjacentNodes(player.location.id);
  if (Detective.isDetective(player) && player.tickets[moveType] < 1) {
    return false;
  }
  let edgeTargets = (window._sigma.graph as any)
    .adjacentEdges(player.location.id)
    .filter((e) => e.attributes.type == moveType && e.source != e.target)
    .map((e) => {
      if (String(e.target) != String(player.location.id)) {
        return String(e.target);
      }
      return String(e.source);
    });
  let ids = neighbours
    .filter((n) => n.id != player.location.id)
    .filter((n) => edgeTargets.includes(String(n.id)))
    .map((n) => n.id);
  if (Detective.isDetective(player)) {
    return ids.includes(String(move)) && !window.detectives.map((d) => d.location.id).includes(Number(move));
  }
  return ids.includes(String(move));
}
/**
 * Get an object representing the current game state
 * @param turnCounter
 * @param playerToMove
 * @returns {GameState}
 */
export function getGameState(turnCounter, playerToMove): GameState {
  return {
    X: window.X,
    detectives: window.detectives,
    turnCounter: turnCounter,
    playerToMove: playerToMove,
  };
}
/**
 * Check if the given player has any legal moves
 * @param {Player} player
 */
function checkIfAnyValidMoves(player: Player) {
  for (let edge in EdgeType) {
    for (let node of (window._sigma.graph as any).adjacentNodes(player.location.id)) {
      if (validMove(player, node.id, edge as EdgeType)) {
        return true;
      }
    }
  }
  return false;
}
/**
 * Get the best move from the current player from the game server.
 *
 * Returned promise will resolve after server responds
 * @param gameState
 * @returns {Promise<GraphNode>}
 */
async function getMoveFromServer(gameState: GameState): Promise<GraphNode> {
  const url = "/move";
  const method = "POST";
  addToSidebar("Getting move from server...");
  var originalLocId = gameState.playerToMove.location.id;
  const intervalId = setInterval(function () {
    let node = lookupNodeById(originalLocId);
    if (node.color === black && !MisterX.isMisterX(gameState.playerToMove)) {
      node.color = gameState.playerToMove.color;
    } else {
      node.color = black;
    }
    window._sigma.refresh();
  }, 1000);
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      clearInterval(intervalId);
      setNodeColor(originalLocId, black);
      if (this.status >= 200 && this.status < 300) {
        let move: NodeInfo = JSON.parse(xhr.response);

        let msg = "Success!";
        if (move.moveDebugStr && window.showDebug) {
          msg += move.moveDebugStr;
        }
        addToSidebar(msg);
        resolve(new GraphNode(move));
      } else {
        addToSidebar(
          "Failed request to server: " +
            JSON.stringify({
              status: this.status,
              statusText: xhr.statusText,
            })
        );
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      addToSidebar(
        "Failed request to server: " +
          JSON.stringify({
            status: this.status,
            statusText: xhr.statusText,
          })
      );
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    if (MisterX.isMisterX(gameState.playerToMove)) {
      gameState.exploitationParameter = window.misterXExplorationParam;
      gameState.moveProcessTime = window.xMoveTime;
    } else {
      gameState.exploitationParameter = window.detectiveExplorationParam;
      gameState.moveProcessTime = window.detectiveMoveTime;
    }
    xhr.send(JSON.stringify(gameState));
  });
}

/**
 * Check if detectives have found X
 * @returns {boolean}
 */
function xIsCaught() {
  return window.detectives.map((p) => p.location.id).includes(window.X.location.id);
}
