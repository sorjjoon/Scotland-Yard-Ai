import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { Player, Role } from "../domain/players/Player";
import { GameState } from "../MCST/GameState";
import { black, xColor } from "../utils/constants";
import { getGameState } from "./main";
import { lookupNodeById } from "./utils";

/**
 * Replay a new game, starting from turn 0
 */
export function replayGame() {
  setUpReplay();
  displayTurn(0);
}
/**
 * Setup needed for replay
 */
function setUpReplay() {
  const header = document.getElementById("replay-header");
  header.classList.add("show");
}

/**
 * Display the given turn.
 * @param {number} turn
 */
export function displayTurn(turn: number) {
  const currentTurn = window.gameHistory[turn];
  const side = document.getElementById("sidebar");
  side.innerHTML = currentTurn.chatHistory;
  side.scrollTop = side.scrollHeight;

  window._sigma.graph.nodes().forEach((e) => {
    e.color = black;
  });
  lookupNodeById(currentTurn.X.location.id).color = xColor;
  currentTurn.detectives.forEach((d) => {
    lookupNodeById(d.location.id).color = d.color;
  });
  window._sigma.refresh();

  setUpButton(document.getElementById("replay-prev") as HTMLButtonElement, turn - 1);
  setUpButton(document.getElementById("replay-next") as HTMLButtonElement, turn + 1);

  document.getElementById("replay-turncounter").innerHTML = "Turn: " + currentTurn.turnCounter;

  let playerStr;
  if (MisterX.isMisterX(currentTurn.playerToMove)) {
    playerStr = "<span style='color:{0};'>Mister X".formatString(currentTurn.playerToMove.color);
  } else if (Detective.isDetective(currentTurn.playerToMove)) {
    playerStr = "<span style='color:{0};'>Detective {1}</span>".formatString(
      currentTurn.playerToMove.color,
      currentTurn.playerToMove.id
    );
  } else {
    playerStr = "<b>Game end</b>";
  }
  document.getElementById("replay-player").innerHTML = "Player to move: " + playerStr;
}
/**
 * Setup the given button.
 *
 * Makes the button disabled, if the given turn is invalid
 * @param  {HTMLButtonElement} button
 * @param  {number} newTurn
 */
function setUpButton(button: HTMLButtonElement, newTurn: number) {
  if (newTurn < 0 || newTurn >= window.gameHistory.length) {
    button.disabled = true;
  } else {
    button.disabled = false;
    button.onclick = function () {
      displayTurn(newTurn);
    };
  }
}
/**
 * Push the current game state to history
 * @param  {number} turnCounter
 * @param  {Player} playerToMove
 */
export function pushGameState(turnCounter: number, playerToMove: Player) {
  const state: GameState = JSON.parse(JSON.stringify(getGameState(turnCounter, playerToMove)));
  state.chatHistory = document.getElementById("sidebar").innerHTML;
  window.gameHistory.push(state);
}
