import express from "express";
import path from "path";
import { Detective, MisterX, Player } from "../domain/player";
import {
  detectiveColors,
  detectiveCount,
  revealTurns,
  taxiTickets,
  xColor,
} from "../utils/constant";
import { GameState } from "../MCST/gamestate";
import { GameMap } from "../domain/gamemap";
import { readFileSync } from "fs";
import { EdgeType } from "../domain/graphnode";
import { getRandom } from "../utils/utils";

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
  require("./prototypes")

  app.set("view engine", "ejs");
  
  app.use("/public", express.static(path.join(process.cwd(), "public")));


  app.post("/move", (req, res) => {
    const gameState: GameState = req.body;
    if (gameState === null) {
      res.status(500).send({
        message: "Empty message body",
      });
    }
     res.json({id: gameMap.getNode(gameState.playerToMove.location.id).getNeighbours(EdgeType.TAXI).getRandom().id})
  });
  
  app.get("/", (req, res) => {
    detectiveColors.shuffle(); //Different colors every game
    const players:Player[] = [];
    for (let id = 1; id < detectiveCount + 1; id++) {
      players.push(
        new Detective(null, id, detectiveColors[id - 1], taxiTickets)
      );
      
    }
    
    players.push(new MisterX(null, players.length + 1, xColor));
    res.render("index", { players: players, revealTurns: revealTurns });
  });

  app.listen(port, () => {
    console.log(`Setup success! Server is running at http://localhost:${port}`);
  });
};

export const gameMap = GameMap.loadMap(
  readFileSync(
    path.join(process.cwd(), "public", "graph", "taxi_data.json"),
    "utf8"
  )
);
main().catch((err) => {
  console.error(err);
});
