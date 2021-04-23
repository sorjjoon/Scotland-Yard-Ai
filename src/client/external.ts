import { Color } from "../utils/constants";
import * as replay from "./replay";
import * as setup from "./setup";
import * as utils from "./utils";

export function replayGame() {
  replay.replayGame();
}

export async function startGame() {
  //Setup replay loops:
  const setUpValues: setup.gameSetupParams = {};
  window.players.forEach((p) => {
    let type = (document.getElementById("ai-select-{0}".formatString(p.id)) as HTMLInputElement).value;
    setUpValues[p.id] = type;
  });
  setUpValues.detectivesSeeX = (document.getElementById("detectives-see-x") as HTMLInputElement).checked;
  setUpValues.debugStr = (document.getElementById("playout-debug") as HTMLInputElement).checked;

  if ((document.getElementById("loop-game") as HTMLInputElement).checked) {
    var dWins = 0;
    var games = 0;
    while (true) {
      dWins += Number(await setup.startGame(setUpValues));
      games++;
      console.info("{0} games played: Detective wins {1}".formatString(games, dWins));
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
