import { Detective } from "../domain/players/Detective";
import { MisterX } from "../domain/players/MisterX";
import { gameMap } from "./GameMap";
import { SerializedPlayer } from "../domain/players/SerializedPlayer";

export function createPlayerFromObject(player: SerializedPlayer): Detective | MisterX {
  if (Detective.isDetective(player)) {
    return new Detective(
      gameMap.getNode(player.location.id),
      Number(player.id),
      player.color,
      Number(player.taxiTickets)
    );
  }
  return new MisterX(
    gameMap.getNode(player.location?.id),
    Number(player.id),
    player.color,
    gameMap.getNode(player.locationKnownToDetectives?.id),
    player.turnCounterForLocation
  );
}
