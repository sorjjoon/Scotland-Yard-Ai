import { readFileSync } from "fs";
import { GameTree } from "../../src/MCST/GameTree";
import path from "path";
require("../../src/utils/prototypes");
describe("Test GameState cloning", () => {
  const testSize = 10;
  const exampleStates = JSON.parse(
    readFileSync(path.join(process.cwd(), "__tests__", "data", "longExampleGame.json"), "utf8")
  );

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
      if (Object.keys(exampleStates[i].playerToMove).length == 0) {
        expect(i).toEqual(clonedStates.length - 1);
      } else {
        try {
          expect(state.playerToMove.equalTo(exampleStates[i].playerToMove)).toBe(true);
        } catch (err) {
          // --- add additional data to the error message here ---
          state.playerToMove.location = null;
          exampleStates[i].playerToMove.location = null;
          err.message = `${err.message}\n\nFirst: ${JSON.stringify(
            state.playerToMove,
            undefined,
            2
          )} \n\n Second: ${JSON.stringify(exampleStates[i].playerToMove, undefined, 2)} \n\n i=${i}`;
          throw err;
        }
      }

      expect(state.turnCounter).toEqual(exampleStates[i].turnCounter);
    }
  });
});
