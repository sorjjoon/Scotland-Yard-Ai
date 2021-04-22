import { Color } from "../utils/constants";
import * as replay from "./replay";
import * as setup from "./setup";
import * as utils from "./utils";

export function replayGame() {
  replay.replayGame();
}

export async function startGame() {
  const gameSetup = document.getElementById("sidebar").innerHTML;
  //Setup replay loops:
  if ((document.getElementById("loop-game") as HTMLInputElement).checked) {
    var dWins = 0;
    var games = 0;
    while (true) {
      dWins += Number(setup.startGame());
      games++;
      console.log(setup.startGame());
      console.info("{0} games played: Detective wins {1}".formatString(games, dWins));
      document.getElementById("sidebar").innerHTML = gameSetup;
    }
  } else {
    setup.startGame();
  }
}

export function fetchGraph() {
  setup.fetchGraph();
}

export function displayTurn(turn) {
  replay.displayTurn(turn);
}
export function updateVisibleEdges() {
  utils.updateVisibleEdges();
}
export function lookupNodeById(id) {
  return utils.lookupNodeById(id);
}
export function setNodeColor(id, newColor = Color.red) {
  utils.setNodeColor(id, newColor);
}
