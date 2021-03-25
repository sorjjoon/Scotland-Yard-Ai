import { EdgeType } from "../src/domain/graphnode";
import { gameMap } from "../src/utils/constant";
import { GameMap } from "../src/domain/gamemap";

describe("Test gamemap", () => {
  const gamemap = gameMap;
  test("Test gamemap is loaded", () => {
    expect(gamemap).toBeInstanceOf(GameMap);
  });

  test("Test node getter", () => {
    const nodes = gamemap.getAllNodes();
    expect(nodes.length).toEqual(199);
    for (let i = 1; i < 200; i++) {
      let node = gameMap.getNode(i);
      expect(node.id).toEqual(i);
    }
  });

  test("Test node edges", () => {
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

  test("Test edge bidirectionality", () => {
    const nodes = gamemap.getAllNodes();
    expect(nodes.length).toEqual(199);
    for (let nodeId = 1; nodeId < 200; nodeId++) {
      let node = gameMap.getNode(nodeId);
      node.getNeighbours(EdgeType.TAXI).forEach((neighbour) => {
        expect(
          neighbour.getNeighbours(EdgeType.TAXI).map((x) => x.id) 
        ).toContain(nodeId);
      });
    }
  });
});
