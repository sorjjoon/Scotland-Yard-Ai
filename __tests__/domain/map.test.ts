import { GameMap } from "../../src/domain/GameMap";
import { EdgeType } from "../../src/domain/GraphNode";
import { gameMap } from "../../src/server/GameMap";

describe("Test gamemap", () => {
  const gamemap = gameMap;
  test("gamemap is loaded", () => {
    expect(gamemap).toBeInstanceOf(GameMap);
  });

  test("node getter", () => {
    const nodes = gamemap.getAllNodes();
    expect(nodes.length).toEqual(199);
    for (let i = 1; i < 200; i++) {
      let node = gameMap.getNode(i);
      expect(node.id).toEqual(i);
    }
  });

  test("node edges are correct", () => {
    //Testing a few example nodes

    const testNode1 = gameMap.getNode(32);
    const edges1 = testNode1.getNeighbours(EdgeType.TAXI);
    expect(edges1.length).toEqual(4);
    var ids = edges1.map((x) => x.id);
    expect(ids).toEqual([19, 33, 44, 45]);

    const testNode2 = gameMap.getNode(8);
    const edges2 = testNode2.getNeighbours(EdgeType.TAXI);
    expect(edges2.length).toEqual(3);
    ids = edges2.map((x) => x.id);
    expect(ids).toEqual([1, 18, 19]);

    const testNode3 = gameMap.getNode(5);
    const edges3 = testNode3.getNeighbours(EdgeType.TAXI);
    expect(edges3.length).toEqual(2);
    ids = edges3.map((x) => x.id);
    expect(ids).toEqual([15, 16]);

    const testNode4 = gameMap.getNode(100);
    const edges4 = testNode4.getNeighbours(EdgeType.TAXI);
    expect(edges4.length).toEqual(5);
    ids = edges4.map((x) => x.id);
    expect(ids).toEqual([80, 81, 101, 112, 113]);

    const testNode5 = gameMap.getNode(116);
    const edges5 = testNode5.getNeighbours(EdgeType.TAXI);
    expect(edges5.length).toEqual(4);
    ids = edges5.map((x) => x.id);
    expect(ids).toEqual([104, 117, 118, 127]);
  });

  test("edge bidirectionality", () => {
    const nodes = gamemap.getAllNodes();
    expect(nodes.length).toEqual(199);
    for (let nodeId = 1; nodeId < 200; nodeId++) {
      let node = gameMap.getNode(nodeId);
      node.getNeighbours(EdgeType.TAXI).forEach((neighbour) => {
        expect(neighbour.getNeighbours(EdgeType.TAXI).map((x) => x.id)).toContain(nodeId);
      });
    }
  });

  const starts = [21, 11, 4, 199, 10];
  const ends = [33, 163, 72, 18, 33];
  const avoidNodes = [[], [], [], [], [21, 2]];
  const answers = [
    [21, 33],
    [11, 163],
    [4, 42, 72],
    [199, 128, 89, 13, 46, 1, 8, 18],
    [10, 34, 46, 33],
  ];
  test.each(starts.map((_, i) => [starts[i], ends[i], avoidNodes[i], answers[i]]))(
    "find route. start: %s, end: %s",
    (start, end, avoid, answer) => {
      let route = gameMap
        .findShortestPath(gameMap.getNode(start as number), gameMap.getNode(end as number), avoid as number[])
        .map((n) => n.id);
      expect(route).toEqual(answer);
    }
  );
});
