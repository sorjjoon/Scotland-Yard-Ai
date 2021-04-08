import * as replay from "./replay";
import * as setup from "./setup";

export function replayGame() {
  replay.replayGame();
}

export function startGame() {
  setup.startGame();
}

export function fetchGraph() {
  setup.fetchGraph();
}

export function displayTurn(turn) {
  replay.displayTurn(turn);
}
