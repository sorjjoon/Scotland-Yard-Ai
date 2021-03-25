import { gameMap } from ".";
import { Detective, MisterX, Role , UnknownPlayer} from "../domain/player";

export function  createPlayerFromObject(player: UnknownPlayer): Detective | MisterX {
    if (player.role === Role.DETECTIVE) {
      return new Detective(
        gameMap.getNode(player.location.id),
        player.id,
        player.color,
        player.taxiTickets
      );
      
    }
    return new MisterX(
      gameMap.getNode(player.location.id),
      player.id,
      player.color,
      player.locationKnownToDetectives,
      player.turnCounterForLocation
    );
  }