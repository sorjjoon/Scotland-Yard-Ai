import { GameMap } from "./domain/gamemap";
import { readFileSync } from "fs";
import path from "path"

//Block execution until map is loaded
export const gameMap = GameMap.loadMap(readFileSync(path.join(process.cwd(), 'public', "graph", "taxi_data.json"), 'utf8'))