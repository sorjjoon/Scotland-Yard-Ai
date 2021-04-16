import { Color } from "../utils/constants";
import * as replay from "./replay";
import * as setup from "./setup";
import * as utils from "./utils";

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
export function updateVisibleEdges() {
  utils.updateVisibleEdges();
}
export function lookupNodeById(id) {
  return utils.lookupNodeById(id);
}
export function setNodeColor(id, newColor = Color.red) {
  utils.setNodeColor(id, newColor);
}
