import { GraphNode } from "../../src/domain/graphnode";
import { gameMap } from "../../src/server/GameMap";
import { readFileSync } from "fs";

import path from "path";

describe("Test node type guard", () => {
  test("actual nodes", () => {
    gameMap.getAllNodes().forEach((element) => {
      expect(GraphNode.isGraphNode(element)).toBe(true);
    });
  });

  test("sigma nodes", () => {
    const sigmaNodes = JSON.parse(readFileSync(path.join(process.cwd(), "public", "graph", "taxi_data.json"), "utf-8"));
    sigmaNodes.nodes.forEach((element) => {
      expect(GraphNode.isGraphNode(element)).toBe(true);
    });
  });
});
