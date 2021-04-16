import * as prot from "../utils/prototypes";

import { GraphNode } from "../domain/GraphNode";
import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { Player } from "../domain/players/Player";
import { mainLoop } from "./main";
import { addToSidebar, lookupNodeById, setNodeColor } from "./utils";
import { detectiveStartingNodes, gameDuration, revealTurns, xStartingNodes } from "../utils/constants";
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
  }
}
/**
 * Set up the window for a new game.
 *
 * Sigma should be loaded before calling this function (loadGraph)
 */
export function startGame() {
  window.gameActive = false;
  window.detectives = [];
  window.gameHistory = [];
  window.players = window.players.map((p) => {
    if (Detective.isDetective(p)) {
      return new Detective(null, p.id, p.color, p.tickets);
    } else if (MisterX.isMisterX(p)) {
      return new MisterX(null, p.id, p.color, null, null);
    }
  });
  var players = window.players;
  players.forEach((p) => {
    let type = (document.getElementById("ai-select-{0}".formatString(p.id)) as HTMLInputElement).value;
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
  window.showDebug = (document.getElementById("playout-debug") as HTMLInputElement).checked;
  if ((document.getElementById("detectives-see-x") as HTMLInputElement).checked) {
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
  mainLoop();
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
        //@ts-ignore, type declarations are for prev version?
        drawLabels: true,
      },
    },
    function (s) {
      window._sigma = s;
      s.bind("clickNode", function (e) {
        if (window.gameActive) {
          window.clickedNode = e.data.node;
        }
      });
    }
  );
}
