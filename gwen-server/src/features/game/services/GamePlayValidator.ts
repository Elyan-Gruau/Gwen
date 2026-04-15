import type { PlayCardRequest } from 'gwen-common';
import type { Game, Player } from 'gwen-common';

export class GamePlayValidator {
  /**
   * Validates a play card action
   * For now, this always validates successfully and will be enhanced later
   */
  public static validatePlayCard(
    _game: Game,
    _playingPlayer: Player,
    _request: PlayCardRequest,
  ): { valid: boolean; error?: string } {
    // TODO: Add actual validation logic
    // - Check if it's the player's turn
    // - Check if the card exists in the player's hand
    // - Check if the row is valid for the card type
    // - Check any other game rules

    // For now, always return valid
    return { valid: true };
  }
}
