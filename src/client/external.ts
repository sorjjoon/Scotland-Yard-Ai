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

  setUpValues.detectiveMoveTime = parseInt((document.getElementById("d-time") as HTMLInputElement).value);
  setUpValues.xMoveTime = parseInt((document.getElementById("x-time") as HTMLInputElement).value);

  if ((document.getElementById("loop-game") as HTMLInputElement).checked) {
    console.log("Starting gameplay loop");
    var dWins = 0;
    var games = 0;

    const varyParam = (document.getElementById("vary-param") as HTMLInputElement).value;
    const roundsBetween = parseInt((document.getElementById("rounds-before") as HTMLInputElement)?.value ?? "1");
    const candidateCount = parseInt((document.getElementById("candidates") as HTMLInputElement).value);
    var candidates: number[];

    const varyTime = (document.getElementById("vary-time") as HTMLInputElement).value;
    const timeIncrement = parseInt((document.getElementById("incr-time") as HTMLInputElement).value);

    while (true) {
      if (setUpValues.detectiveMoveTime <= 0 || setUpValues.xMoveTime <= 0) {
        console.log("Movetime negative, breaking loop");
        break;
      }
      let results = Array(candidateCount);
      switch (varyParam) {
        case "D":
          candidates = generateCandidates(window.detectiveExplorationParam, candidateCount);
          break;
        case "X":
          candidates = generateCandidates(window.misterXExplorationParam, candidateCount);
          break;
        default:
          //Array will not be used. 20 is just a random number (cant be empty, or the next loop won't work)
          candidates = Array(20);
          break;
      }

      for (let i = 0; i < candidates.length; i++) {
        if (varyParam == "D") {
          window.detectiveExplorationParam = candidates[i];
        } else if (varyParam == "X") {
          window.misterXExplorationParam = candidates[i];
        }
        let dWinsThisRound = 0;
        for (let _ = 0; _ < roundsBetween; _++) {
          let res = await setup.startGame(setUpValues);
          dWins += Number(res);
          dWinsThisRound += Number(res);
          games++;
          window.players = JSON.parse(originalPlayers);
          console.info("{0} games played: Detective wins {1}.".formatString(games, dWins));
        }
        switch (varyTime) {
          case "X":
            setUpValues.xMoveTime += timeIncrement;
            break;
          case "D":
            setUpValues.detectiveMoveTime += timeIncrement;
            break;
          default:
            break;
        }
        console.log("Setup params: " + JSON.stringify(setUpValues, null, 2));
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
        let indexes = getAllMaxIndex(results, (a, b) => a - b);
        console.log("Best candidates (new will be avg from these)");
        let bestCandidates = candidates.filter((_, i) => indexes.includes(i));
        console.log(String(bestCandidates));
        let avg = utils.sumArray(bestCandidates) / bestCandidates.length;
        window.detectiveExplorationParam = avg;
        console.log("Updating exploration param, new param (for detectives): " + window.detectiveExplorationParam);
      } else if (varyParam == "X") {
        let indexes = getAllMaxIndex(results, (a, b) => b - a);
        console.log("Best candidates (new will be avg from these)");
        let bestCandidates = candidates.filter((_, i) => indexes.includes(i));
        console.log(String(bestCandidates));
        let avg = utils.sumArray(bestCandidates) / bestCandidates.length;
        window.misterXExplorationParam = avg;
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

function getAllMaxIndex<T>(arr: T[], comparator: (a: T, b: T) => number): number[] {
  var max: number[];
  arr.forEach((x, i) => {
    if (max == undefined) {
      max = [i];
    } else {
      let comp = comparator(arr[max[0]], x);
      if (comp == 0) {
        max.push(i);
      } else if (comp < 0) {
        max = [i];
      }
    }
  });
  return max;
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
