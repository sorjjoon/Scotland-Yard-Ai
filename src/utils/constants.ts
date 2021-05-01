/**
 * rgb values for common colors
 */
export enum Color {
  red = "rgb(235, 64, 52)",
  green = "rgb(50, 168, 82)",
  brown = "rgb( 138, 105, 6)",
  cyan = "rgb(50, 154, 168)",
  blue = "rgb(0, 102, 255)",
  violet = "rgb(115, 0, 150)",
  pink = "rgb(255, 0, 255)",
  orange = "rgb(255, 153, 51)",
  lightGreen = "rgb(173, 255, 47)",
  lightBrown = "rgb(210, 180, 140)",
}
export const black = "rgb(0, 0, 0)";

/**
 * Contents in this file can be freely modifed to customize the gameplay (remember to recompile and restart the server afterwards. Depending on your browser, you may have to do a full page refresh, ignoring cache as well. Usually ctrl + refresh).
 * If you are changing the file a lot,
 * instead of using 'npm run compile' and 'npm run start', use 'npm run watch', 'npm run pack' and 'npm run demon' (all changes will be automatically loaded and the server restarted upon file save)
 */

/**
 * How long MCTS is run when processing moves
 */
export const moveProcessTime = 2 * 1000; //ms
/**
 * Max distance detectives can be from X, before instead of MCTS detectives simply take the shortest path towards X
 */
export const maxDistanceBeforeRushing = 5;

export const detectiveStartingNodes = [44, 58, 32, 92, 66, 14, 39, 71, 105, 42, 135, 158, 170, 167, 182, 165, 124];
export const xStartingNodes = [45, 97, 50, 68, 86, 142, 156, 149, 146];

export const detectiveCount = 3;

export const taxiTickets = 11;
export const busTickets = 8;
export const metroTickets = 4;

export const gameDuration = taxiTickets + busTickets + metroTickets - 1;
export const revealTurns = [1, 3, 8, 13, 16, 20, 23];

export const xColor = Color.red;
export const detectiveColors: readonly Color[] = Object.keys(Color)
  .filter((key) => Color[key] !== xColor && typeof Color[key] === "string")
  .map((key) => Color[key]);

export enum AITypes {
  HUMAN = "0",
  RANDOM = "1",
  "PURE MCTS" = "2",
  "EXPLORATIVE MCTS" = "3",
}
