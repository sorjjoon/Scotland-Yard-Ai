import { readFileSync } from "fs";
import { GameMap } from "../domain/GameMap";
import path from "path";
import { PureSearchTree } from "../MCST/search_trees/PureSearchTree";

export const gameMap = GameMap.loadMap(
  readFileSync(path.join(process.cwd(), "public", "graph", "taxi_data.json"), "utf8")
);

export const moveProcessTime = 5 * 1000; //ms

export enum AITypes {
  HUMAN = "0",
  RANDOM = "1",
  "PURE MCTS" = "2",
}
