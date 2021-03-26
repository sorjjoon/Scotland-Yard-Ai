import { readFileSync } from "fs";
import { GameMap } from "../domain/gamemap";
import path from "path";

export const gameMap = GameMap.loadMap(
    readFileSync(
      path.join(process.cwd(), "public", "graph", "taxi_data.json"),
      "utf8"
    )
  );