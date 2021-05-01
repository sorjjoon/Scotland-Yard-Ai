import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { Player } from "../domain/players/Player";

/**
 * GameState objects used by client side scripts to represent the current state of the game
 */
export interface GameState {
  detectives: Detective[];
  X: MisterX;
  turnCounter: number;
  playerToMove: Player;
  chatHistory?: string;
  exploitationParameter?: number;
  moveProcessTime?: number;
}
