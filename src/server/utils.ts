import { Detective, MisterX, Role , UnknownPlayer} from "../domain/player";
import { gameMap } from "./constants";

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