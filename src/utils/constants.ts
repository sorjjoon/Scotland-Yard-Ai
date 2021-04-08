export enum Color {
  red = "rgb(235, 64, 52)",
  green = "rgb(50, 168, 82)",
  brown = "rgb( 138, 105, 6)",
  cyan = "rgb(50, 154, 168)",
  blue = "rgb(0, 102, 255)",
  violet = "rgb(115, 0, 150)",
  pink = "rgb(255, 0, 255)",
  orange = "rgb(255, 153, 51)",
}
export const black = "rgb(0, 0, 0)";

//Game constants
export const moveProcessTime = 5 * 1000; //ms

export const gameDuration = 23;
export const revealTurns = [1, 3, 8, 13, 23];

export const detectiveStartingNodes = [44, 58, 32, 92, 66, 14, 39, 71, 105, 42, 135, 158, 170, 167, 182, 165, 124];
export const xStartingNodes = [45, 97, 50, 68, 86, 142, 156, 149, 146];

export const detectiveCount = 3;
export const taxiTickets = 22;

export const xColor = Color.red;
export const detectiveColors: readonly Color[] = Object.keys(Color)
  .filter((key) => Color[key] !== xColor && typeof Color[key] === "string")
  .map((key) => Color[key]);

export enum AITypes {
  HUMAN = "0",
  RANDOM = "1",
  "PURE MCTS" = "2",
}
