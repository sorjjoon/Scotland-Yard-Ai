import { Color } from "../utils/constants";
import * as replay from "./replay";
import * as setup from "./setup";
import * as utils from "./utils";

export function replayGame() {
  replay.replayGame();
}

export async function startGame() {
  window.misterXExplorationParam = parseFloat(
    (document.getElementById("start-param-X") as HTMLInputElement)?.value ?? String(Math.SQRT2)
  );
  window.detectiveExplorationParam = parseFloat(
    (document.getElementById("start-param-D") as HTMLInputElement)?.value ?? String(Math.SQRT2)
  );

  //Setup replay loops:
  const setUpValues: setup.gameSetupParams = {};
  const originalPlayers = JSON.stringify(window.players);
  window.players.forEach((p) => {
    let type = (document.getElementById("ai-select-{0}".formatString(p.id)) as HTMLInputElement).value;
    setUpValues[p.id] = type;
  });
  setUpValues.detectivesSeeX = (document.getElementById("detectives-see-x") as HTMLInputElement).checked;
  setUpValues.debugStr = (document.getElementById("playout-debug") as HTMLInputElement).checked;

  if ((document.getElementById("loop-game") as HTMLInputElement).checked) {
    var dWins = 0;
    var games = 0;

    const varyParam = (document.getElementById("vary-param") as HTMLInputElement).value;
    const roundsBetween = parseInt((document.getElementById("rounds-before") as HTMLInputElement)?.value ?? "1");
    const candidateCount = parseInt((document.getElementById("candidates") as HTMLInputElement).value);
    var candidates: number[];

    while (true) {
      if (varyParam == "D") {
        candidates = generateCandidates(window.detectiveExplorationParam, candidateCount);
      } else if (varyParam == "X") {
        candidates = generateCandidates(window.misterXExplorationParam, candidateCount);
      } else {
        //Just so the next loop works
        candidates = Array(20);
      }

      let results = Array(candidates.length);

      for (let i = 0; i < candidates.length; i++) {
        if (varyParam == "D") {
          window.detectiveExplorationParam = candidates[i];
        } else if (varyParam == "X") {
          candidates = generateCandidates(window.misterXExplorationParam, candidateCount);
          window.misterXExplorationParam = candidates[i];
        }
        let dWinsThisRound = 0;
        for (let i = 0; i < roundsBetween; i++) {
          let res = await setup.startGame(setUpValues);
          dWins += Number(res);
          dWinsThisRound += Number(res);
          games++;
          window.players = JSON.parse(originalPlayers);
          console.info("{0} games played: Detective wins {1}".formatString(games, dWins));
        }

        results[i] = dWinsThisRound;
      }
      if (varyParam !== "no") {
        console.log("Candidates:");
        console.log(String(candidates));

        console.log("Results for candidates:");
        console.log(String(results));
      }
      //Update param, using the highest success from last round max results if updating for detective, min result if updating for X
      if (varyParam == "D") {
        window.detectiveExplorationParam = candidates[getMaxIndex(results, (a, b) => a - b)];
        console.log("Updating exploration param, new param (for detectives): " + window.detectiveExplorationParam);
      } else if (varyParam == "X") {
        window.misterXExplorationParam = candidates[getMaxIndex(results, (a, b) => b - a)];
        console.log("Updating exploration param, new param (for X): " + window.misterXExplorationParam);
      }
    }
  } else {
    setup.startGame();
  }
}

function generateCandidates(start: number, childrenCount: number) {
  const res = [];
  for (let i = 0; i < childrenCount; i++) {
    res.push(start * utils.randomFloat(0.85, 1.15));
  }
  return res;
}

function getMaxIndex(arr: number[], key: (x, y) => number) {
  var max = arr[0];
  var maxI = 0;
  arr.forEach((x, i) => {
    if (key(max, x) < 0) {
      max = x;
      maxI = i;
    }
  });
  return maxI;
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
