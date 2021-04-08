import express from "express";
import path from "path";
import { Player } from "../domain/players/Player";
import { Color, detectiveColors, detectiveCount, revealTurns, taxiTickets, xColor } from "../utils/constants";
import { GameState } from "../MCST/GameState";
import { format } from "util";
import { MisterX } from "../domain/players/MisterX";
import { Detective } from "../domain/players/Detective";

import { PureSearchTree } from "../MCST/search_trees/PureSearchTree";
import { AITypes, gameMap, moveProcessTime } from "./constants";
import { EdgeType } from "../domain/GraphNode";
import { monteCarloSearch } from "../MCST/MCTS";
import { GameTree } from "../MCST/GameTree";

/**
 * Main entry point for the app
 */

const main = async () => {
  console.log("Setting up server");
  const port = 5000;
  const app = express();
  app.use(express.json());

  //Load prototypes
  require("../utils/prototypes");
  require("../domain/players/prototypes");

  app.set("view engine", "ejs");

  app.use("/public", express.static(path.join(process.cwd(), "public")));

  //Log all incoming requests
  app.use(function (req, res, next) {
    console.info(format("[%s] at %s requested %s", new Date().toUTCString(), req.ip, req.url));
    next();
  });

  app.post("/move", async (req, res) => {
    const gameState: GameState = req.body;

    if (gameState === null) {
      res.status(500).send({
        message: "Empty message body",
      });
    }

    var move;
    switch (gameState.playerToMove.aiType) {
      case AITypes.RANDOM:
        move = gameMap.getNode(gameState.playerToMove.location.id).getNeighbours(EdgeType.TAXI).getRandom();
        break;
      case AITypes["PURE MCTS"]:
        move = monteCarloSearch(GameTree.cloneGameState(gameState), moveProcessTime, PureSearchTree);
        break;
      default:
        res.status(500).send({
          message: "Invalid ai type",
        });
        break;
    }
    res.json(move.details);
  });

  app.get("/", (req, res) => {
    detectiveColors.shuffle(); //Different colors every game
    const players: Player[] = [];
    for (let id = 1; id < detectiveCount + 1; id++) {
      players.push(new Detective(null, id, detectiveColors[id - 1], taxiTickets));
    }

    players.push(new MisterX(null, players.length + 1, xColor));

    res.render("index", { players: players, revealTurns: revealTurns, aiTypes: AITypes });
  });

  app.listen(port, () => {
    console.log(`Setup success! Server is running at http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
