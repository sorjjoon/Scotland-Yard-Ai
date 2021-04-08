import { readFileSync } from "fs";
import path from "path";
import { MisterX } from "../../src/domain/players/MisterX";
import { lookUpBasedOnKey } from "../../src/utils/utils";
import { GameState } from "../../src/MCST/GameState";
import { GameTree } from "../../src/MCST/GameTree";
import { Role } from "../../src/domain/players/Player";
import { Detective } from "../../src/domain/players/Detective";
import { gameDuration } from "../../src/utils/constants";
import { gameMap } from "../../src/server/constants";
import { EdgeType } from "../../src/domain/GraphNode";

describe("Test GameTree", () => {
  const xStart = 50;
  const d1Start = 14;
  const d2Start = 135;
  const d3Start = 44;
  var xMoves: number[], d1Moves: number[], d2Moves: number[], d3Moves: number[];

  var exampleGame: GameState[], tree: GameTree;
  beforeEach(() => {
    exampleGame = JSON.parse(readFileSync(path.join(__dirname, "shortExampleGame.json"), "utf8"));
    tree = new GameTree(GameTree.cloneGameState(exampleGame[0]));
    xMoves = [38, 24, 38];
    d1Moves = [25, 38];
    d2Moves = [143, 129];
    d3Moves = [32, 45];
  });
  test("Detective ids are [1,2,3]", () => {
    for (let state of exampleGame) {
      expect(tree.state.detectives.map((d) => d.id)).toEqual(state.detectives.map((d) => d.id));
      expect(tree.state.detectives.map((d) => d.id)).toEqual([1, 2, 3]);
    }
  });
  test("Children lengths are correct", () => {
    for (const [i, s] of exampleGame.entries()) {
      tree = new GameTree(GameTree.cloneGameState(s));
      if (Object.keys(s.playerToMove).length !== 0) {
        let correctChildrenCount = 0;
        if (MisterX.isMisterX(s.playerToMove)) {
          correctChildrenCount = GameTree.gameMap.getNode(s.playerToMove.location.id).getNeighbours(EdgeType.TAXI)
            .length;
        } else {
          GameTree.gameMap
            .getNode(s.playerToMove.location.id)
            .getNeighbours(EdgeType.TAXI)
            .forEach((element) => {
              if (!tree.state.detectives.map((d) => d.location.id).includes(element.id)) {
                correctChildrenCount++;
              }
            });
        }
        expect(tree.getChildren().length).toEqual(correctChildrenCount);
      } else {
        // {}  should be the player to move only for the final state
        expect(i).toEqual(exampleGame.length - 1);
      }
    }
  });
  test("Children lengths are  unchanged for x in case neighbouring detectives", () => {
    const originalNeighbours = tree.state.X.location.getNeighbours(EdgeType.TAXI).length;
    expect(originalNeighbours).toEqual(tree.getChildren().length);
    expect(tree.state.playerToMove.role).toEqual(Role.X);
    tree.state.detectives[0].location = tree.state.X.location.getNeighbours(EdgeType.TAXI)[0];
    tree["children"] = null;
    expect(tree.getChildren().length).toEqual(originalNeighbours);
  });

  test("Children lengths are correct detective in case neighbouring detectives", () => {
    tree = tree.getChildren()[0];
    expect(tree.state.playerToMove.role).toEqual(Role.DETECTIVE);
    const originalNeighbours = tree.state.detectives[0].location.getNeighbours(EdgeType.TAXI).length;
    expect(originalNeighbours).toEqual(tree.getChildren().length);
    tree.state.detectives[1].location = tree.state.detectives[0].location.getNeighbours(EdgeType.TAXI)[0];
    tree["children"] = null;
    expect(tree.getChildren().length).toEqual(originalNeighbours - 1);
  });

  test("Chosen move from tree", () => {
    for (let i = 1; i < exampleGame.length; i++) {
      let tree = new GameTree(exampleGame[i]);
      let prevTree = new GameTree(exampleGame[i - 1]);
      const moveId = GameTree.getChosenMoveFromTree(prevTree, tree.state).id;
      let arr;
      switch (prevTree.state.playerToMove.id) {
        case 1:
          arr = d1Moves;
          break;
        case 2:
          arr = d2Moves;
          break;
        case 3:
          arr = d3Moves;
          break;
        case 4:
          arr = xMoves;
          break;
        default:
          throw Error("invalid id?");
      }
      expect(arr).toContain(moveId);
      arr.splice(0, 1);
    }
  });
  test("Start positions are correct", () => {
    expect(tree.state.playerToMove.equalTo(exampleGame[0].X)).toBe(true);
    expect(tree.state.X.location.id).toEqual(xStart);
    expect(tree.state.X.locationKnownToDetectives).toBeFalsy();
    expect(tree.state.X.turnCounterForLocation ?? null).toBeNull();

    expect(tree.state.turnCounter).toEqual(0);
    expect(tree.state.detectives.map((d) => d.location.id)).toEqual([d1Start, d2Start, d3Start]);
    expect(tree.getWinner()).toBeNull();
  });
  test("First move is found in children", () => {
    const children = tree.getChildren();
    expect(children.length).toEqual(4);
    expect(children.map((x) => x.state.X.location.id)).toContain(xMoves[0]);

    children.forEach((x) => {
      expect(x.state.playerToMove.id).not.toEqual(tree.state.playerToMove.id);
      expect(x.getWinner()).toBeNull();
      expect(x.state.turnCounter).toEqual(1);
      expect(x.state.playerToMove.equalTo(exampleGame[0].detectives[0])).toBe(true);
      for (let i = 0; i < x.state.detectives.length; i++) {
        expect(x.state.detectives[i].equalTo(exampleGame[0].detectives[i])).toBe(true);
      }
    });
  });
  test("Entire game can be found in children", () => {
    var root = tree;
    const detectiveTickets = {};
    const initialDetectiveTickets = {};
    for (let d of exampleGame[0].detectives) {
      detectiveTickets[d.id] = d.taxiTickets;
      initialDetectiveTickets[d.id] = d.taxiTickets;
    }

    for (let i = 1; i < exampleGame.length; i++) {
      let current = exampleGame[i];
      let newState = getChosenMoveFromTree(root, current);
      if (current.turnCounter !== 2) expect(newState).not.toBeNull();
      root = newState;
      if (i < exampleGame.length - 1) {
        expect(root.getWinner()).toBeNull();
      } else {
        expect(root.getWinner()).toEqual(Role.DETECTIVE);
      }
      expect(root.state.turnCounter).toEqual(current.turnCounter);
      for (let j = 0; j < root.state.detectives.length; j++) {
        let d1 = root.state.detectives[j];
        let d2 = current.detectives[j];

        expect(d1.equalTo(d2)).toBe(true);
        expect(d1.taxiTickets).toEqual(detectiveTickets[d1.id]);

        if (root.state.turnCounter > 1) {
          expect(d1.taxiTickets).toBeLessThan(initialDetectiveTickets[d1.id]);
        }
      }
      if (Detective.isDetective(root.state.playerToMove)) {
        detectiveTickets[root.state.playerToMove.id]--;
      }
    }
  });
  /**
   * Returns the child from the inital game tree which matches the new state
   * Checks that the provided moves are correct (contained in d1Moves if detective 1 moved etc.)
   * Returns null in case the provided move was not found (check the result for null)
   * @param  {GameTree} inital
   * @param  {GameState} newState
   * @returns GameTree
   */
  function getChosenMoveFromTree(inital: GameTree, newState: GameState): GameTree | null {
    var moveId;
    if (MisterX.isMisterX(inital.state.playerToMove)) {
      moveId = newState.X.location.id;
    } else {
      moveId = lookUpBasedOnKey(newState.detectives, "id", inital.state.playerToMove.id).location.id;
    }
    let arr;
    switch (inital.state.playerToMove.id) {
      case 1:
        arr = d1Moves;
        break;
      case 2:
        arr = d2Moves;
        break;
      case 3:
        arr = d3Moves;
        break;
      case 4:
        arr = xMoves;
        break;
      default:
        throw Error("invalid id?");
    }
    expect(arr).toContain(moveId);
    arr.splice(0, 1);

    for (let child of inital.getChildren()) {
      if (MisterX.isMisterX(inital.state.playerToMove)) {
        if (child.state.X.location.id == moveId) {
          return child;
        }
      } else {
        let detectiveWhoMoved = lookUpBasedOnKey(child.state.detectives, "id", inital.state.playerToMove.id);
        if (detectiveWhoMoved.location.id === moveId) {
          return child;
        }
      }
    }
    return null;
  }
  test("Turncounter is correct and MisterX win condition", () => {
    var current = tree;
    var correctTurncounter = 0;
    const maxTurns = gameDuration * 4 + 1;
    var loopCounter = 0;
    while (correctTurncounter != gameDuration) {
      //Detectives  picks the smallest neighbour node, X picks the largest.
      // Detectvies wont catch X
      expect(current.state.turnCounter).toEqual(correctTurncounter);
      expect(current.getWinner()).toBeNull();
      let temp = current.getChildren();
      expect(temp[0].state.playerToMove.id).not.toEqual(current.state.playerToMove.id);
      if (Detective.isDetective(current.state.playerToMove)) {
        current = temp[0];
      } else {
        correctTurncounter++;
        current = temp[temp.length - 1];
      }

      expect(loopCounter).toBeLessThanOrEqual(maxTurns);
      loopCounter++;
    }
    expect(correctTurncounter).toEqual(gameDuration);
    expect(current.state.turnCounter).toEqual(gameDuration);
    expect(current.getWinner()).toEqual(Role.X);
  });
});
