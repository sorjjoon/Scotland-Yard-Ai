//Force prototype loading for webpack
import * as _ from "./prototypes";

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

//Game constants
export const gameDuration = 23;
export const revealTurns = [1, 3, 8, 13, 23];

export const detectiveCount = 3;
export const taxiTickets = 22;

export const xColor = Color.red;
export const detectiveColors: Color[] = []
Object.keys(Color).forEach(function (key) {
  if (Color[key] !== xColor && Color[key]) {
    detectiveColors.push(Color[key]);
  }
});

