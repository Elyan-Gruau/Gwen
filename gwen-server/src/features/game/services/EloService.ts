import type { GameResult } from 'gwen-common';

export class EloService {
  private static readonly K_FACTOR = 32; // Standard K-factor for ELO calculation

  /**
   * Calculate ELO change for a player based on their current ELO, opponent's ELO, and game result
   *
   * Formula:
   * - Expected Score = 1 / (1 + 10^((opponent_elo - player_elo) / 400))
   * - ELO Change = K * (actual_score - expected_score)
   *
   * Where actual_score is:
   * - 1.0 for WIN
   * - 0.5 for DRAW
   * - 0.0 for LOSS
   *
   * @param playerElo Current ELO of the player
   * @param opponentElo Current ELO of the opponent
   * @param result Game result from the player's perspective
   * @returns ELO change (can be positive or negative)
   */
  static calculateEloChange(playerElo: number, opponentElo: number, result: GameResult): number {
    // Convert result to actual score (0, 0.5, or 1)
    const actualScore = result === 'WIN' ? 1.0 : result === 'DRAW' ? 0.5 : 0.0;

    // Calculate expected score
    const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));

    // Calculate ELO change
    const eloChange = this.K_FACTOR * (actualScore - expectedScore);

    return Math.round(eloChange);
  }

  /**
   * Calculate new ELO after a game
   */
  static getNewElo(currentElo: number, eloChange: number): number {
    return currentElo + eloChange;
  }
}
