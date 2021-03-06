import * as prot from "../utils/prototypes";

import { GraphNode } from "../domain/GraphNode";
import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { Player } from "../domain/players/Player";
import { mainLoop } from "./main";
import { addToSidebar, lookupNodeById, setNodeColor } from "./utils";
import { black, detectiveStartingNodes, gameDuration, revealTurns, xStartingNodes } from "../utils/constants";
import { GameState } from "../MCST/GameState";

declare global {
  interface Window {
    _sigma: SigmaJs.Sigma;
    detectives: Detective[];
    X: MisterX;
    players: Player[];
    revealTurns: number[];
    gameActive: boolean;
    clickedNode: SigmaJs.Node;
    gameHistory: GameState[];
    showDebug: boolean;
    misterXExplorationParam: number;
    detectiveExplorationParam: number;
    detectiveMoveTime: number;
    xMoveTime: number;
  }
}

export interface gameSetupParams {
  aiTypes?: { [key: number]: string };
  detectivesSeeX?: boolean;
  debugStr?: boolean;
  detectiveMoveTime?: number;
  xMoveTime?: number;
}

/**
 * Set up the window for a new game.
 *
 * Sigma should be loaded before calling this function (loadGraph)
 */
export function startGame(params: gameSetupParams = {}) {
  window._sigma.graph.nodes().forEach((n) => {
    n.color = black;
  });
  window._sigma.refresh();
  window.gameActive = false;
  window.detectives = [];
  window.gameHistory = [];

  window.detectiveMoveTime =
    params.detectiveMoveTime ?? parseInt((document.getElementById("d-time") as HTMLInputElement).value);
  window.xMoveTime = params.xMoveTime ?? parseInt((document.getElementById("x-time") as HTMLInputElement).value);

  window.players = window.players.map((p) => {
    if (Detective.isDetective(p)) {
      return new Detective(null, p.id, p.color, p.tickets);
    } else if (MisterX.isMisterX(p)) {
      return new MisterX(null, p.id, p.color, null, null);
    } else {
      throw Error("unknown play role?");
    }
  });
  var players = window.players;
  players.forEach((p) => {
    let type = params[p.id] ?? (document.getElementById("ai-select-{0}".formatString(p.id)) as HTMLInputElement).value;
    p.isPlayedByAI = type != "0";
    p.aiType = type;
    if (Detective.isDetective(p)) {
      window.detectives.push(p);
    } else if (MisterX.isMisterX(p)) {
      window.X = p;
    } else {
      //Shouldn't happen
      console.error(p);
      throw Error("Invalid player role");
    }
  });
  window.showDebug = params.debugStr ?? (document.getElementById("playout-debug") as HTMLInputElement).checked;
  if (params.detectivesSeeX ?? (document.getElementById("detectives-see-x") as HTMLInputElement).checked) {
    window.revealTurns = [...Array(gameDuration + 1).keys()];
  } else {
    window.revealTurns = revealTurns;
  }
  addToSidebar("Game log");
  addToSidebar("Setting up...");
  document.getElementById("sidebar").innerHTML = "";

  detectiveStartingNodes.shuffle();
  xStartingNodes.shuffle();

  players.forEach((p, i) => {
    if (Detective.isDetective(p)) {
      p.location = new GraphNode(lookupNodeById(detectiveStartingNodes[i]));
      setNodeColor(p.location.id, p.color);
    } else {
      p.location = new GraphNode(lookupNodeById(xStartingNodes[0]));
    }
  });

  addToSidebar("Done! Game Starting...");
  return mainLoop();
}

/**
 * Make the ajax request to load
 */
export function fetchGraph() {
  sigma.parsers.json(
    "public/graph/taxi_data.json",
    {
      container: "graph-container",

      settings: {
        //@ts-ignore
        drawLabes: true,
      },
    },
    function (s) {
      window._sigma = s;
      s.bind("clickNode", function (e) {
        if (window.gameActive) {
          window.clickedNode = e.data.node;
        }
        s.graph.nodes().forEach((element) => {
          element.maxNodeSize = 1;
        });
      });
    }
  );
}
