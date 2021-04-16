import { readFileSync } from "fs";
import path from "path";
import { MisterX } from "../../src/domain/players/MisterX";
import { lookUpBasedOnKey } from "../../src/utils/utils";
import { GameState } from "../../src/MCST/GameState";
import { GameTree } from "../../src/MCST/GameTree";
import { Player, Role } from "../../src/domain/players/Player";
import { Detective } from "../../src/domain/players/Detective";
import { busTickets, gameDuration, metroTickets, taxiTickets } from "../../src/utils/constants";
import { gameMap } from "../../src/server/GameMap";
import { EdgeType } from "../../src/domain/GraphNode";
import { createPlayerFromObject } from "../../src/server/utils";
describe("Test GameTree static utils functions", () => {
  var exampleGame: GameState[], tree: GameTree;
  beforeEach(() => {
    exampleGame = JSON.parse(
      readFileSync(path.join(process.cwd(), "__tests__", "data", "shortExampleGame.json"), "utf8")
    ).map((x) => GameTree.cloneGameState(x));
    tree = new GameTree(GameTree.cloneGameState(exampleGame[0]));
  });

  test("findPossibleXLocations (returns empty for invalid move)", () => {
    var game = exampleGame[8];
    game.X.movesSinceReveal = [EdgeType.METRO];
    var locs = GameTree.findPossibleXLocations(game, game.X.movesSinceReveal);
    expect(locs).toEqual([]);
  });

  test("findPossibleXLocations (just moved)", () => {
    var locs = GameTree.findPossibleXLocations(exampleGame[0], exampleGame[0].X.movesSinceReveal);
    expect(locs.length).toEqual(1);
    expect(locs[0].id).toEqual(tree.state.X.location.id);

    locs = GameTree.findPossibleXLocations(exampleGame[1], exampleGame[1].X.movesSinceReveal);
    expect(locs.length).toEqual(1);
    expect(locs[0].id).toEqual(exampleGame[1].X.location.id);
  });

  test("findPossibleXLocations (1 hidden move)", () => {
    var game = exampleGame[8];
    expect(game.X.movesSinceReveal).toEqual([EdgeType.TAXI]);
    var locs = GameTree.findPossibleXLocations(game, game.X.movesSinceReveal);
    expect(locs.length).toEqual(game.X.locationKnownToDetectives.getNeighbours(EdgeType.TAXI).length);
    expect(locs.map((l) => l.id)).toContain(game.X.location.id);
  });

  var xStarts = [9, 13, 18, 46, 57, 19];
  var xMoves = [
    [EdgeType.TAXI, EdgeType.METRO],
    [EdgeType.TAXI, EdgeType.BUS],
    [EdgeType.TAXI, EdgeType.TAXI, EdgeType.METRO],
    [EdgeType.METRO, EdgeType.METRO, EdgeType.TAXI],
    [],
    [EdgeType.TAXI, EdgeType.TAXI, EdgeType.TAXI],
  ];
  var correctData = [
    [46],
    [42, 3, 22, 67, 13, 15, 52],
    [46],
    [33, 45, 61, 47, 83, 102, 84, 68, 51, 50, 66, 71, 88, 105, 112, 110, 124, 92, 94],
    [57],
    [31, 43, 8, 9, 2, 33, 21, 20, 46, 60, 59, 58, 32],
  ];
  const data = xStarts.map((x, i) => [x, xMoves[i], correctData[i]]);
  test.each(data)("findPossibleXlocations: start: %s, moves: %s", (start, moves, answer) => {
    const game = exampleGame[0];
    game.X.location = GameTree.gameMap.getNode(start as number);
    game.X.locationKnownToDetectives = GameTree.gameMap.getNode(start as number);
    game.X.movesSinceReveal = moves as EdgeType[];

    const locs = GameTree.findPossibleXLocations(game, game.X.movesSinceReveal).map((x) => x.id);
    locs.sort((a, b) => a - b);
    (answer as []).sort((a, b) => a - b);
    expect(locs).toEqual(answer);
  });

  test("findPossibleXLocations (2 hidden moves, taxi/bus)", () => {
    var game = exampleGame[8];

    expect(game.X.movesSinceReveal).toEqual([EdgeType.TAXI]);
    var locs = GameTree.findPossibleXLocations(game, game.X.movesSinceReveal);
    expect(locs.length).toEqual(game.X.locationKnownToDetectives.getNeighbours(EdgeType.TAXI).length);
    expect(locs.map((l) => l.id)).toContain(game.X.location.id);
  });
});
