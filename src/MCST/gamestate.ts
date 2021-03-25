import { Detective, MisterX, Player } from "../domain/player";

export interface GameState {
  detectives: Detective[];
  X: MisterX;
  turnCounter: number;
  playerToMove: Player;
}

export function cloneGameState(state: GameState): GameState {
  return {
    detectives: state.detectives.map((d) => d.clone()),
    X: state.X.clone(),
    turnCounter: state.turnCounter,
    playerToMove: state.playerToMove.clone(),
  };
}
