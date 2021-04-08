import { readFileSync } from "fs";
import path from "path";
import { gameMap } from "../../src/server/GameMap";
import { EdgeType, GraphNode } from "../../src/domain/GraphNode";
import { Detective } from "../../src/domain/players/Detective";
import { MisterX } from "../../src/domain/players/MisterX";
import { GameState } from "../../src/MCST/GameState";
import { GameTree } from "../../src/MCST/GameTree";

describe("Test Player", () => {
  var exampleGame: GameState[], tree: GameTree;
  beforeEach(() => {
    exampleGame = JSON.parse(readFileSync(path.join(__dirname, "shortExampleGame.json"), "utf8"));
    tree = new GameTree(GameTree.cloneGameState(exampleGame[0]));
  });
  test("Player equalTo", () => {
    for (const [i, d] of tree.state.detectives.entries()) {
      expect(d.equalTo(exampleGame[1].detectives[i])).toBe(true);
      expect(d.equalTo(tree.getChildren()[0].state.detectives[i]));
    }
    expect(tree.state.X.equalTo(exampleGame[1].X)).toBe(false);
    expect(tree.state.detectives.map((d) => d.equalTo(exampleGame[0].X))).not.toContain(true);

    expect(tree.state.X.equalTo("something random")).toBe(false);
    expect(tree.state.X.equalTo({ random: "object" })).toBe(false);
    expect(tree.state.X.equalTo(gameMap.getNode(42))).toBe(false);

    const copyOfD = tree.state.detectives[0].clone();
    expect(copyOfD.equalTo(tree.state.detectives[0])).toBe(true);
    copyOfD.taxiTickets++;
    expect(copyOfD.equalTo(tree.state.detectives[0])).toBe(false);
  });
  test("Player equalTo, nullish location history MisterX", () => {
    tree = new GameTree(GameTree.cloneGameState(exampleGame[3]));
    const copyOfX = tree.state.X.clone();
    expect(copyOfX.equalTo(tree.state.X)).toBe(true);

    const originalLocationKnownToDetectives = copyOfX.locationKnownToDetectives;
    const originalturnCounterForLocation = copyOfX.turnCounterForLocation;

    copyOfX.locationKnownToDetectives = null;
    expect(copyOfX.equalTo(tree.state.X)).toBe(false);
    expect(tree.state.X.equalTo(copyOfX)).toBe(false);
    copyOfX.locationKnownToDetectives = originalLocationKnownToDetectives;
    expect(copyOfX.equalTo(tree.state.X)).toBe(true);

    copyOfX.turnCounterForLocation = null;
    expect(copyOfX.equalTo(tree.state.X)).toBe(false);
    expect(tree.state.X.equalTo(copyOfX)).toBe(false);
    copyOfX.turnCounterForLocation = originalturnCounterForLocation;
    expect(copyOfX.equalTo(tree.state.X)).toBe(true);
  });
  test("Player type guard", () => {
    expect(Detective.isDetective(tree.state.X)).toBe(false);
    expect(Detective.isDetective(exampleGame[0].X)).toBe(false);

    expect(tree.state.detectives.map((d) => MisterX.isMisterX(d))).not.toContain(true);

    expect(MisterX.isMisterX(tree.state.X)).toBe(true);
    expect(tree.state.detectives.map((d) => Detective.isDetective(d))).not.toContain(false);
  });
  test("Detective and X makeMove", () => {
    const x = tree.state.X;
    const d = tree.state.detectives[0];
    x.makeMove(21, EdgeType.TAXI);
    expect(x.location).toBeInstanceOf(GraphNode);
    expect(x.location.id).toEqual(21);

    const dTickets = d.taxiTickets;
    d.makeMove(21, EdgeType.TAXI);
    expect(d.location).toBeInstanceOf(GraphNode);
    expect(d.taxiTickets).toEqual(dTickets - 1);

    x.makeMove(gameMap.getNode(25), EdgeType.TAXI);
    expect(x.location).toBeInstanceOf(GraphNode);
    expect(x.location).toBe(gameMap.getNode(25));

    d.makeMove(gameMap.getNode(25), EdgeType.TAXI);
    expect(d.location).toBeInstanceOf(GraphNode);
    expect(d.location).toBe(gameMap.getNode(25));
    expect(d.taxiTickets).toEqual(dTickets - 2);
  });
});
