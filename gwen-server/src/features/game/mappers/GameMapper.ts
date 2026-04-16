import type { Game } from 'gwen-common';

import { PlayerMapper } from './PlayerMapper';
import { PlayerRowMapper } from './PlayerRowMapper';
import { DTOGameEndResult, DTOGameWithMetadata, DTORoundEndResult } from '../dtos/DTOGame';

export class GameMapper {
  static async toDTOWithMetadata(
    gameWithMetadata: any,
    usernames: Record<string, string>,
    metadata: any,
    lastRoundResult?: DTORoundEndResult,
    gameEndResult?: DTOGameEndResult,
  ): Promise<DTOGameWithMetadata> {
    const game = gameWithMetadata.game;
    return {
      metadata,
      game: {
        phase: game.getPhase(),
        currentRound: game.getCurrentRound(),
        currentPlayerTurnUserId: game.getCurrentPlayerTurnUserId(),
        turnStartedAt: game.getTurnStartedAt()?.toISOString() ?? null,
        player1: PlayerMapper.toDTO(game.getPlayer1()),
        player2: PlayerMapper.toDTO(game.getPlayer2()),
        player1Rows: PlayerRowMapper.toDTO(game.getPlayer1Rows()),
        player2Rows: PlayerRowMapper.toDTO(game.getPlayer2Rows()),
        lastRoundResult: lastRoundResult || null,
        gameEndResult: gameEndResult || null,
      },
      usernames,
    };
  }
}
