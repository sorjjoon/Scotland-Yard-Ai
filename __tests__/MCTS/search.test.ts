import { readFileSync } from "fs";
import path from "path";
import { GameTree } from "../../src/MCST/GameTree";
import { PureSearchTree } from "../../src/MCST/search_trees/PureSearchTree";
import { GameState } from "../../src/MCST/GameState";
import { lookUpBasedOnKey } from "../../src/utils/utils";
import { MisterX } from "../../src/domain/players/MisterX";
import { Role } from "../../src/domain/players/Player";
import { EdgeType, GraphNode } from "../../src/domain/GraphNode";
import { Detective } from "../../src/domain/players/Detective";
import { ExplorativeSearchTree } from "../../src/MCST/search_trees/ExplorativeSearchTree";

interface TreeConstructor {
  new (initial: GameState): GameTree;
}
const startLocation = JSON.parse(
  readFileSync(path.join(process.cwd(), "__tests__", "data", "shortExampleGame.json"), "utf8")
)[0];
var trees: TreeConstructor[], testNames: string[], tests: Array<[string, TreeConstructor]>;
tests = [];
trees = [PureSearchTree, ExplorativeSearchTree];
testNames = ["Pure", "Explorative"];
for (let i = 0; i < trees.length; i++) {
  tests.push([testNames[i], trees[i]]);
}
describe.each(tests)("Test MCTS: (%s)", (name, treeConstructor) => {
  var tree: GameTree;
  beforeEach(() => {
    tree = new treeConstructor(GameTree.cloneGameState(startLocation));
  });
  test("Tree is loaded", () => {
    expect(tree.constructor.prototype).toBeInstanceOf(GameTree);
    expect(MisterX.isMisterX(tree.state.playerToMove));
  });

  test("Single playout", () => {
    expect(tree.visits).toEqual(0);
    tree.playout();
    expect(tree.visits).toEqual(1);

    const XWon = tree.wins == 1;
    var loopCounter = 0;
    var totalWins = 0;
    var current = tree;
    while (!current.getWinner()) {
      let childVisits = current.getChildren().map((x) => x.visits);
      childVisits.sort((a, b) => b - a);
      expect(childVisits[0]).toEqual(1);
      childVisits.splice(0, 1);
      expect(childVisits).not.toContain(1);
      for (let v of childVisits) {
        expect(v).toEqual(0);
      }
      totalWins += current.wins;
      if (MisterX.isMisterX(current.state.playerToMove)) {
        expect(current.wins).toEqual(Number(XWon));
      } else {
        expect(current.wins).toEqual(Number(!XWon));
      }
      current = lookUpBasedOnKey(current.getChildren(), "visits", 1);
      loopCounter++;
    }
    totalWins += current.wins;
    expect(totalWins).toBeGreaterThan(0);
    if (XWon) {
      expect(totalWins).toEqual((loopCounter - 1) / 4 + 1);
    } else {
      expect(totalWins).toBeGreaterThanOrEqual(Math.floor((loopCounter / 4) * 3));
      expect(totalWins).toBeLessThanOrEqual(Math.floor((loopCounter / 4) * 3) + 3);
    }
    expect(current.getWinner()).not.toBeNull();
    if (XWon) {
      expect(current.getWinner()).toEqual(Role.X);
    } else {
      expect(current.getWinner()).toEqual(Role.DETECTIVE);
    }
  });
  test("Playout until root is not a leaf", () => {
    expect(tree.visits).toEqual(0);
    expect(tree["isLeaf"]()).toBe(true);
    var i = 0;
    for (i; i < tree.getChildren().length; i++) {
      tree.playout();
    }
    expect(tree["isLeaf"]()).toBe(false);
    expect(tree.visits).toEqual(i);
    var totalWins = 0;
    for (let child of tree.getChildren()) {
      expect(child.visits).toEqual(1);
      expect(child.wins).toBeLessThanOrEqual(1);
      totalWins += child.wins;
      expect(child["isLeaf"]()).toBe(true);
      expect(child["children"]).not.toBeNull();
    }
    expect(tree.wins).toEqual(i - totalWins);

    tree.playout();
    expect(tree.visits).toEqual(i + 1);
    const childVisits = tree.getChildren().map((c) => c.visits);
    expect(childVisits).toContain(2);
    childVisits.sort((a, b) => b - a);
    childVisits.splice(0, 1);
    expect(childVisits).not.toContain(2);
    totalWins = 0;
    for (let child of tree.getChildren()) {
      totalWins += child.wins;
    }
    expect(tree.wins).toEqual(i + 1 - totalWins);
  });
  test("Playout 100 times, and get the best move (next player different role than current)", () => {
    expect(tree.visits).toEqual(0);
    expect(MisterX.isMisterX(tree.state.playerToMove)).toBe(true);
    for (let i = 0; i < 100; i++) {
      tree.playout();
    }
    const best = tree.getBestMove();
    expect(best.constructor.prototype).toBeInstanceOf(GameTree);
    expect(
      tree.state.X.location.getAllNeighbours([EdgeType.TAXI, EdgeType.BUS, EdgeType.METRO]).map((x) => x.id)
    ).toContain(best.state.X.location.id);
  });
  test("Playout 100 times, and get the best move, (next player same role as current)", () => {
    tree = tree.getChildren()[0];
    expect(Detective.isDetective(tree.state.playerToMove)).toBe(true);
    expect(tree.state.playerToMove.id).toEqual(1);
    expect(tree.visits).toEqual(0);
    for (let i = 0; i < 100; i++) {
      tree.playout();
    }
    const [best, _] = GameTree.getChosenMoveFromTree(tree, tree.getBestMove().state);

    //Swap the player to move
    tree.state.playerToMove = tree.state.detectives[tree.state.detectives.length - 1];
    expect(tree.state.playerToMove.id).not.toEqual(1);

    const [bestAfterSwap, __] = GameTree.getChosenMoveFromTree(tree, tree.getBestMove().state);

    expect(best.id).not.toEqual(bestAfterSwap.id);
  });

  test("ExploitationParameter param is passed to children (only for explorative)", () => {
    if (tree instanceof ExplorativeSearchTree) {
      tree.exploitationParameter = 2;
      for (let c of tree.getChildren()) {
        expect(c.exploitationParameter).toEqual(2);
        for (let c2 of c.getChildren()) {
          expect(c2.exploitationParameter).toEqual(2);
          for (let c3 of c2.getChildren()) {
            expect(c3.exploitationParameter).toEqual(2);
            c3.exploitationParameter = 3;
            for (let c4 of c3.getChildren()) {
              expect(c4.exploitationParameter).toEqual(3);
            }
          }
        }
      }
    }
  });
});
