import type { Player } from 'gwen-common/dist/model/Player';
import { DTOPlayer } from '../dtos/DTOPlayer';
import { DeckMapper } from './DeckMapper';

export abstract class PlayerMapper {
  static toDTO(player: Player): DTOPlayer {
    return {
      userId: player.getUserId(),
      gems: player.getGems(),
      passed: player.hasPassed(),
      deck: DeckMapper.toDTO(player.getDeck()),
    };
  }
}
