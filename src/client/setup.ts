import * as prot from "../utils/prototypes";

import { GraphNode } from "../domain/GraphNode";
import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { Player } from "../domain/players/Player";
import { mainLoop } from "./main";
import { addToSidebar, lookupNodeById, setNodeColor } from "./utils";
import { detectiveStartingNodes, xStartingNodes } from "../utils/constants";
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
  addToSidebar("Game log");
  addToSidebar("Setting up...");

  window.gameActive = false;
  window.detectives = [];
  window.gameHistory = [];
  window.players = window.players.map((p) => {
    if (Detective.isDetective(p)) {
      return new Detective(null, p.id, p.color, p.taxiTickets);
    } else if (MisterX.isMisterX(p)) {
      return new MisterX(null, p.id, p.color, null, null);
    }
    console.error("Invalid player role");
    console.error(p);
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
      console.error("Invalid player role");
      console.error(p);
    }
  });
  window.showDebug = (document.getElementById("playout-debug") as HTMLInputElement).checked;
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
      //sigma.neighborhood plugin needs adjacentEdges to know which nodes are neighbouring one another
      sigma.classes.graph.addMethod("adjacentEdges", function (id) {
        id = Number(id);
        //@ts-ignore
        var a = this.allNeighborsIndex[id],
          eid,
          target,
          edges = [];

        for (target in a) {
          for (eid in a[target]) {
            edges.push(a[target][eid]);
          }
        }
        return edges;
      });
    }
  );
}
