import { readFileSync } from "fs";
import { GameTree } from "../../src/MCST/GameTree";
import path from "path";
require("../../src/utils/prototypes");
describe("Test GameState cloning", () => {
  const exampleStates = [];
  const testSize = 10;
  const exampleGame = JSON.parse(readFileSync(path.join(__dirname, "exampleGame.json"), "utf8"));
  for (let i = 0; i < testSize; i++) {
    exampleStates.push(exampleGame.getRandom());
  }
  test("Clone properties do not share identity", () => {
    for (const [_, element] of exampleStates.entries()) {
      let clone = GameTree.cloneGameState(element);
      expect(clone).not.toBe(element);
      Object.keys(clone).forEach((key) => {
        if (typeof clone[key] !== "number") {
          expect(clone[key]).not.toBe(element[key]);
        }
      });
    }
  });

  test("Clone properties are correct", () => {
    const clonedStates = exampleStates.map((x) => GameTree.cloneGameState(x));
    expect(clonedStates.length).toEqual(exampleStates.length);
    for (const [i, state] of clonedStates.entries()) {
      for (const [j, detective] of state.detectives.entries()) {
        expect(detective.equalTo(exampleStates[i].detectives[j])).toBe(true);
      }
      expect(state.X.equalTo(exampleStates[i].X)).toBe(true);
      expect(state.playerToMove.equalTo(exampleStates[i].playerToMove)).toBe(true);
      expect(state.turnCounter).toEqual(exampleStates[i].turnCounter);
    }
  });
});
