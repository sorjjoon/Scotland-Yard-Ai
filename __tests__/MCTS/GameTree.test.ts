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

describe("Test GameTree", () => {
  const xStart = 149;
  const d1Start = 44;
  const d2Start = 170;
  const d3Start = 158;
  var xMoves: number[], d1Moves: number[], d2Moves: number[], d3Moves: number[];

  var exampleGame: GameState[], tree: GameTree;
  beforeEach(() => {
    exampleGame = JSON.parse(
      readFileSync(path.join(process.cwd(), "__tests__", "data", "shortExampleGame.json"), "utf8")
    );
    tree = new GameTree(GameTree.cloneGameState(exampleGame[0]));
    xMoves = [148, 123, 124];
    d1Moves = [58, 77, 124];
    d2Moves = [185, 153];
    d3Moves = [157, 185];
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
          correctChildrenCount = GameTree.gameMap
            .getNode(s.playerToMove.location.id)
            .getAllNeighbours(Object.values(EdgeType)).length;
        } else {
          GameTree.gameMap
            .getNode(s.playerToMove.location.id)
            .getAllNeighbours(Object.values(EdgeType))
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
  test("Children lengts are correct, ticket testing", () => {
    tree = new GameTree(exampleGame[1]);
    const p = tree.state.playerToMove;
    expect(p.role).toEqual(Role.DETECTIVE);
    expect(p.id).toEqual(1);
    p.location = GameTree.gameMap.getNode(138);
    tree.generateChildren();
    expect(tree.getChildren().length).toEqual(3);
    for (let child of tree.getChildren()) {
      expect(child.state.detectives[0].tickets.TAXI).toEqual(p.tickets.TAXI - 1);
      expect(child.state.detectives[0].tickets.BUS).toEqual(p.tickets.BUS);
      expect(child.state.detectives[0].tickets.METRO).toEqual(p.tickets.METRO);
    }

    p.location = GameTree.gameMap.getNode(34);
    tree.state.detectives[0].location = GameTree.gameMap.getNode(34);
    tree["children"] = null;
    expect(tree.getChildren().length).toEqual(8);
    var taxiRoutes = [10, 47, 48];
    var busRoutes = [63, 46, 58];
    var route22 = [EdgeType.BUS, EdgeType.TAXI];
    for (let child of tree.getChildren()) {
      let moveId = child.state.detectives[0].location.id;
      if (taxiRoutes.includes(moveId)) {
        expect(child.state.detectives[0].tickets.TAXI).toEqual(p.tickets.TAXI - 1);
        expect(child.state.detectives[0].tickets.BUS).toEqual(p.tickets.BUS);
        expect(child.state.detectives[0].tickets.METRO).toEqual(p.tickets.METRO);
      } else if (busRoutes.includes(moveId)) {
        expect(child.state.detectives[0].tickets.TAXI).toEqual(p.tickets.TAXI);
        expect(child.state.detectives[0].tickets.BUS).toEqual(p.tickets.BUS - 1);
        expect(child.state.detectives[0].tickets.METRO).toEqual(p.tickets.METRO);
      } else {
        //22
        expect(moveId).toEqual(22);
        expect(child.state.detectives[0].tickets.METRO).toEqual(p.tickets.METRO);
        if (child.state.detectives[0].tickets.BUS < p.tickets.BUS) {
          route22 = route22.filter((x) => x != EdgeType.TAXI);
          expect(child.state.detectives[0].tickets.TAXI).toEqual(p.tickets.TAXI);
          expect(child.state.detectives[0].tickets.BUS).toEqual(p.tickets.BUS - 1);
        } else {
          route22 = route22.filter((x) => x != EdgeType.BUS);
          expect(child.state.detectives[0].tickets.TAXI).toEqual(p.tickets.TAXI - 1);
          expect(child.state.detectives[0].tickets.BUS).toEqual(p.tickets.BUS);
        }
      }
    }
    tree.state.playerToMove.tickets.BUS = 0;
    tree.state.detectives[0].tickets.BUS = 0;
    tree["children"] = null;
    taxiRoutes.push(22);
    taxiRoutes.sort((a, b) => a - b);
    expect(tree.getChildren().length).toEqual(taxiRoutes.length);
    var temp = tree.getChildren().map((x) => x.state.detectives[0].location.id);

    temp.sort((a, b) => a - b);

    expect(temp).toEqual(taxiRoutes);

    tree.state.playerToMove.tickets.TAXI = 0;
    tree.state.detectives[0].tickets.TAXI = 0;
    tree["children"] = null;
    expect(tree.getChildren().length).toEqual(1);
    expect(tree.getChildren()[0].state.detectives[0].location.id).toEqual(tree.state.detectives[0].location.id);
  });
  test("Children lengths are  unchanged for x in case neighbouring detectives", () => {
    const originalNeighbours = tree.state.X.location.getAllNeighbours(Object.values(EdgeType)).length;
    expect(originalNeighbours).toEqual(tree.getChildren().length);
    expect(tree.state.playerToMove.role).toEqual(Role.X);
    tree.state.detectives[0].location = tree.state.X.location.getAllNeighbours(Object.values(EdgeType))[0];
    tree["children"] = null;
    expect(tree.getChildren().length).toEqual(originalNeighbours);
  });

  test("Children lengths are correct detective in case neighbouring detectives", () => {
    tree = tree.getChildren()[0];
    expect(tree.state.playerToMove.role).toEqual(Role.DETECTIVE);
    expect(tree.state.playerToMove.id).toEqual(1);
    const originalNeighbours = tree.state.detectives[0].location.getAllNeighbours(Object.values(EdgeType)).length;
    expect(originalNeighbours).toEqual(tree.getChildren().length);
    tree.state.detectives[1].location = tree.state.detectives[0].location.getAllNeighbours(Object.values(EdgeType))[0];
    const nodeToMoveTo = tree.state.detectives[0].location.getAllNeighbours(Object.values(EdgeType))[0].id;
    var correctRoutes = 0;
    for (let key of Object.values(EdgeType)) {
      if (
        tree.state.detectives[0].location
          .getNeighbours(key)
          .map((n) => n.id)
          .includes(nodeToMoveTo)
      )
        correctRoutes++;
    }
    expect(correctRoutes).toBeGreaterThan(0);
    tree["children"] = null;
    //-2 because there are 2 ways to get to the neighbour in this case (bus and taxi)
    expect(tree.getChildren().length).toEqual(originalNeighbours - correctRoutes);
  });

  test("Chosen move from tree", () => {
    for (let i = 1; i < exampleGame.length; i++) {
      tree = new GameTree(exampleGame[i]);
      if (Object.keys(tree.state.playerToMove).length == 0) {
        expect(i).toEqual(exampleGame.length - 1);
        break;
      }
      let prevTree = new GameTree(exampleGame[i - 1]);
      const moveId = GameTree.getChosenMoveFromTree(prevTree, tree.state)[0].id;
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
    expect(d1Moves.length).toEqual(0);
    expect(d2Moves.length).toEqual(0);
    expect(d3Moves.length).toEqual(0);
    expect(xMoves.length).toEqual(0);
  });
  test("Start positions are correct", () => {
    expect(tree.state.playerToMove.equalTo(createPlayerFromObject(exampleGame[0].X))).toBe(true);
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
    var currentTree = tree;
    const detectiveTickets = {};
    for (let d of exampleGame[0].detectives) {
      detectiveTickets[d.id] = JSON.parse(JSON.stringify(d)).tickets;
      expect(detectiveTickets[d.id]).toEqual({ TAXI: taxiTickets, BUS: busTickets, METRO: metroTickets });
    }

    for (let i = 1; i < exampleGame.length; i++) {
      let current = exampleGame[i];
      if (Object.keys(current.playerToMove).length == 0) {
        expect(i).toEqual(exampleGame.length - 1);
        break;
      }
      let newState = findChosenMoveFromTree(currentTree, current);

      const [move, moveType] = GameTree.getChosenMoveFromTree(new GameTree(exampleGame[i - 1]), exampleGame[i]);
      expect([newState.state.X.location.id].concat(newState.state.detectives.map((d) => d.location.id))).toContain(
        move.id
      );
      if (current.turnCounter !== 2) expect(newState).not.toBeNull();

      currentTree = newState;

      if (i < exampleGame.length - 2) {
        expect(currentTree.getWinner()).toBeNull();
      } else {
        expect(currentTree.getWinner()).toEqual(Role.DETECTIVE);
      }
      expect(currentTree.state.turnCounter).toEqual(current.turnCounter);
      for (let j = 0; j < currentTree.state.detectives.length; j++) {
        let d1 = currentTree.state.detectives[j];
        let d2 = current.detectives[j];

        expect(d1.equalTo(d2)).toBe(true);
      }

      if (Detective.isDetective(exampleGame[i - 1].playerToMove)) {
        detectiveTickets[exampleGame[i - 1].playerToMove.id][moveType]--;
      }
    }
    expect(d1Moves.length).toEqual(0);
    expect(d2Moves.length).toEqual(0);
    expect(d3Moves.length).toEqual(0);
    expect(xMoves.length).toEqual(0);

    expect(detectiveTickets[1]).toEqual({ TAXI: 10, BUS: 6, METRO: 4 });
    expect(detectiveTickets[2]).toEqual({ TAXI: 10, BUS: 8, METRO: 3 });
    expect(detectiveTickets[3]).toEqual({ TAXI: 10, BUS: 7, METRO: 4 });
  });
  /**
   * Returns the child from the inital game tree which matches the new state
   *
   * Checks that the provided moves are correct (contained in d1Moves if detective 1 moved etc.), and splices the move from the list afterwards.
   *
   * Returns null in case the provided move was not found (check the result for null)
   * @param  {GameTree} inital
   * @param  {GameState} newState
   * @returns GameTree
   */
  function findChosenMoveFromTree(inital: GameTree, newState: GameState): GameTree | null {
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
