import { Body, Controller, Get, Path, Post, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { GameService } from '../services/GameService.js';
import { GameManager, GameWithMetadata } from '../services/GameManager.js';
import { EloService } from '../services/EloService.js';
import { UserRepository } from '../../auth/repository/UserRepository.js';

import type {
  DTOFinishGameRequest,
  DTOGame,
  DTOGameWithMetadata,
  DTORoundEndResult,
  DTOGameEndResult,
  DTOPlaceCardRequest,
  DTOPassTurnRequest,
  DTOSurrenderRequest,
  DTOGameHistoryEntry,
  DTOGameHistoryPage,
  DTOGameHistoryResult,
} from '../dtos/DTOGame.js';
import { TURN_DURATION_SECONDS } from 'gwen-common';
import type { DBGame } from '../model/DBGame.js';
import { PlayerMapper } from '../mappers/PlayerMapper';
import { PlayerRowMapper } from '../mappers/PlayerRowMapper';

const gameService = new GameService();
const userRepository = new UserRepository();

@Route('games')
@Tags('Games')
export class GameController extends Controller {
  @Get('{gameId}/active')
  @SuccessResponse('200', 'Active game with metadata')
  @Response('404', 'Active game not found')
  @Response('500', 'Server error')
  public async getGameWithMetadataById(@Path() gameId: string): Promise<DTOGameWithMetadata> {
    try {
      const gameManager = GameManager.getInstance();
      const gameWithMetadata = gameManager.getActiveGameById(gameId);
      const { game } = gameWithMetadata;

      // Auto-pass if the current player's turn has exceeded the time limit
      const turnStartedAt = game.getTurnStartedAt();
      const currentPlayerId = game.getCurrentPlayerTurnUserId();
      if (
        turnStartedAt &&
        currentPlayerId &&
        game.getPhase() === 'PLAY_CARDS' &&
        !game.hasPlayerPassed(currentPlayerId)
      ) {
        const elapsedSeconds = (Date.now() - turnStartedAt.getTime()) / 1000;
        if (elapsedSeconds >= TURN_DURATION_SECONDS) {
          game.skipTurn(currentPlayerId);
          game.autoPassIfNoCards(game.getPlayer1().getUserId());
          game.autoPassIfNoCards(game.getPlayer2().getUserId());
        }
      }

      return await this.toDTOGameWithMetadata(gameWithMetadata);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return this.throwHttpError(`Active game with ${gameId} not found`, 404);
      }
      return this.throwHttpError('Failed to retrieve active game', 500);
    }
  }

  @Get('{gameId}')
  @SuccessResponse('200', 'Game details')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async getGame(@Path() gameId: string): Promise<DTOGame> {
    try {
      const game = await gameService.getGame(gameId);
      if (!game) {
        return this.throwHttpError('Game not found', 404);
      }

      return this.toDto(game);
    } catch {
      return this.throwHttpError('Failed to retrieve game', 500);
    }
  }

  @Post('{gameId}/end-round')
  @SuccessResponse('200', 'Round ended, results calculated')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async endRound(@Path() gameId: string): Promise<DTOGameWithMetadata> {
    try {
      const gameManager = GameManager.getInstance();
      const gameWithMetadata = gameManager.getActiveGameById(gameId);
      const game = gameWithMetadata.game;

      // Determine round result and advance game state
      game.determineRoundResult();

      return await this.toDTOGameWithMetadata(gameWithMetadata);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return this.throwHttpError(`Game ${gameId} not found`, 404);
      }
      return this.throwHttpError('Failed to end round', 500);
    }
  }

  @Post('{gameId}/start-round')
  @SuccessResponse('200', 'Round started successfully')
  @Response('400', 'Cannot start round')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async startRound(@Path() gameId: string): Promise<DTOGameWithMetadata> {
    try {
      const gameManager = GameManager.getInstance();
      const gameWithMetadata = gameManager.getActiveGameById(gameId);
      const game = gameWithMetadata.game;

      game.startRound();

      return await this.toDTOGameWithMetadata(gameWithMetadata);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return this.throwHttpError(`Game ${gameId} not found`, 404);
      }
      if (error instanceof Error) {
        return this.throwHttpError(error.message, 400);
      }
      return this.throwHttpError('Failed to start round', 500);
    }
  }

  @Post('{gameId}/place-card')
  @SuccessResponse('200', 'Card placed successfully')
  @Response('400', 'Invalid placement')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async placeCard(
    @Path() gameId: string,
    @Body() body: DTOPlaceCardRequest,
  ): Promise<DTOGameWithMetadata> {
    try {
      const gameManager = GameManager.getInstance();
      const gameWithMetadata = gameManager.getActiveGameById(gameId);
      const game = gameWithMetadata.game;

      if (!body?.playerId || !body?.cardId || !body?.rowType) {
        return this.throwHttpError('playerId, cardId, and rowType are required', 400);
      }

      // Place the card
      game.placeCard(body.playerId, body.cardId, body.rowType);

      // Auto-pass players with no cards left
      const player1 = game.getPlayer1();
      const player2 = game.getPlayer2();
      game.autoPassIfNoCards(player1.getUserId());
      game.autoPassIfNoCards(player2.getUserId());

      return await this.toDTOGameWithMetadata(gameWithMetadata);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return this.throwHttpError(`Game ${gameId} not found`, 404);
      }
      if (error instanceof Error) {
        return this.throwHttpError(error.message, 400);
      }
      return this.throwHttpError('Failed to place card', 500);
    }
  }

  @Post('{gameId}/pass-turn')
  @SuccessResponse('200', 'Turn passed successfully')
  @Response('400', 'Cannot pass turn')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async passTurn(
    @Path() gameId: string,
    @Body() body: DTOPassTurnRequest,
  ): Promise<DTOGameWithMetadata> {
    try {
      const gameManager = GameManager.getInstance();
      const gameWithMetadata = gameManager.getActiveGameById(gameId);
      const game = gameWithMetadata.game;

      if (!body?.playerId) {
        return this.throwHttpError('playerId is required', 400);
      }

      // Pass the turn
      game.passTurn(body.playerId);

      // Auto-pass players with no cards left
      const player1 = game.getPlayer1();
      const player2 = game.getPlayer2();
      game.autoPassIfNoCards(player1.getUserId());
      game.autoPassIfNoCards(player2.getUserId());

      return await this.toDTOGameWithMetadata(gameWithMetadata);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return this.throwHttpError(`Game ${gameId} not found`, 404);
      }
      if (error instanceof Error) {
        return this.throwHttpError(error.message, 400);
      }
      return this.throwHttpError('Failed to pass turn', 500);
    }
  }

  @Post('{gameId}/resign')
  @SuccessResponse('200', 'Player resigned, opponent wins')
  @Response('400', 'Missing playerId')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async resignGame(
    @Path() gameId: string,
    @Body() body: DTOSurrenderRequest,
  ): Promise<DTOGameWithMetadata> {
    try {
      if (!body?.playerId) {
        return this.throwHttpError('playerId is required', 400);
      }

      const gameManager = GameManager.getInstance();
      const gameWithMetadata = gameManager.getActiveGameById(gameId);
      const { game, metadata } = gameWithMetadata;

      // Resign in-memory game
      game.resign(body.playerId);

      // Determine the opponent
      const opponentId =
        game.getPlayer1().getUserId() === body.playerId
          ? game.getPlayer2().getUserId()
          : game.getPlayer1().getUserId();

      // Database
      await gameService.finishGame(metadata._id?.toString() || '', opponentId);

      return await this.toDTOGameWithMetadata(gameWithMetadata);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return this.throwHttpError(`Game ${gameId} not found`, 404);
      }
      if (error instanceof Error) {
        return this.throwHttpError(error.message, 400);
      }
      return this.throwHttpError('Failed to resign', 500);
    }
  }

  @Post('{gameId}/finish')
  @SuccessResponse('200', 'Game finished successfully')
  @Response('400', 'Missing winnerId')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async finishGame(
    @Path() gameId: string,
    @Body() body: DTOFinishGameRequest,
  ): Promise<DTOGame> {
    try {
      if (!body?.winnerId) {
        return this.throwHttpError('winnerId is required', 400);
      }

      const updatedGame = await gameService.finishGame(gameId, body.winnerId);
      if (!updatedGame) {
        return this.throwHttpError('Game not found', 404);
      }

      return this.toDto(updatedGame);
    } catch {
      return this.throwHttpError('Failed to finish game', 500);
    }
  }

  @Get('history/{userId}')
  @SuccessResponse('200', 'Match history')
  @Response('500', 'Server error')
  public async getGameHistory(
    @Path() userId: string,
    @Query() page?: number,
    @Query() limit?: number,
  ): Promise<DTOGameHistoryPage> {
    try {
      const p = page ?? 0;
      const l = Math.min(limit ?? 10, 50);
      const { content, total } = await gameService.getGameHistory(userId, p, l);

      const opponentIds = [...new Set(
        content.map((g) => (g.player1_id === userId ? g.player2_id : g.player1_id)),
      )];
      const opponentUsers = await Promise.all(opponentIds.map((id) => userRepository.findById(id)));
      const opponentMap: Record<string, string> = {};
      opponentIds.forEach((id, i) => {
        opponentMap[id] = opponentUsers[i]?.username ?? id;
      });

      const entries: DTOGameHistoryEntry[] = content.map((g) => {
        const opponentId = g.player1_id === userId ? g.player2_id : g.player1_id;
        let result: DTOGameHistoryResult;
        if (g.status === 'ABANDONED') {
          result = 'ABANDONED';
        } else if (!g.winner_id) {
          result = 'DRAW';
        } else if (g.winner_id === userId) {
          result = 'WIN';
        } else {
          result = 'LOSS';
        }
        return {
          _id: g._id?.toString() ?? '',
          opponent_id: opponentId,
          opponent_username: opponentMap[opponentId] ?? opponentId,
          result,
          status: g.status,
          created_at: g.created_at?.toISOString(),
        };
      });

      return { content: entries, total, page: p, limit: l };
    } catch {
      return this.throwHttpError('Failed to fetch match history', 500);
    }
  }

  @Post('{gameId}/abandon')
  @SuccessResponse('200', 'Game abandoned successfully')
  @Response('404', 'Game not found')
  @Response('500', 'Server error')
  public async abandonGame(@Path() gameId: string): Promise<DTOGame> {
    try {
      const updatedGame = await gameService.abandonGame(gameId);
      if (!updatedGame) {
        return this.throwHttpError('Game not found', 404);
      }

      return this.toDto(updatedGame);
    } catch {
      return this.throwHttpError('Failed to abandon game', 500);
    }
  }

  private toDto(game: DBGame): DTOGame {
    return {
      _id: game._id?.toString() || '',
      player1_id: game.player1_id,
      player2_id: game.player2_id,
      status: game.status,
      winner_id: game.winner_id ?? null,
      created_at: game.created_at?.toISOString(),
      updated_at: game.updated_at?.toISOString(),
    };
  }

  private async toDTOGameWithMetadata(
    gameWithMetadata: GameWithMetadata,
  ): Promise<DTOGameWithMetadata> {
    const { metadata, game } = gameWithMetadata;

    // Fetch usernames
    const player1Id = game.getPlayer1().getUserId();
    const player2Id = game.getPlayer2().getUserId();

    const player1User = await userRepository.findById(player1Id);
    const player2User = await userRepository.findById(player2Id);

    const usernames: Record<string, string> = {
      [player1Id]: player1User?.username || player1Id,
      [player2Id]: player2User?.username || player2Id,
    };

    // Build round end result if a round just ended
    let lastRoundResult: DTORoundEndResult | undefined;
    const p1RoundResult = game.getLastRoundResult(player1Id);
    const p2RoundResult = game.getLastRoundResult(player2Id);

    if (p1RoundResult && p2RoundResult) {
      lastRoundResult = {
        round: game.getCurrentRound(),
        player1_result: p1RoundResult,
        player2_result: p2RoundResult,
        player1_score: game.getPlayer1Rows().getScore(),
        player2_score: game.getPlayer2Rows().getScore(),
        player1_gems: game.getPlayer1().getGems(),
        player2_gems: game.getPlayer2().getGems(),
      };
    }

    // Build game end result if game has ended
    let gameEndResult: DTOGameEndResult | undefined;
    const p1GameResult = game.getGameResult(player1Id);
    const p2GameResult = game.getGameResult(player2Id);

    if (p1GameResult && p2GameResult) {
      const p1Gems = game.getPlayer1().getGems();
      const p2Gems = game.getPlayer2().getGems();
      // Initial gems were 2, so gems lost = 2 - current gems
      const p1GemsLost = 2 - p1Gems;
      const p2GemsLost = 2 - p2Gems;

      // Get the game ID for checking if ELO has already been applied
      const gameId = metadata._id?.toString() || '';

      // Check if ELO has already been applied to this game
      const eloAlreadyApplied = await gameService.checkEloApplied(gameId);

      let p1EloChange: number;
      let p2EloChange: number;

      if (!eloAlreadyApplied) {
        // Calculate ELO changes
        const p1CurrentElo = player1User?.elo ?? 1200;
        const p2CurrentElo = player2User?.elo ?? 1200;

        p1EloChange = EloService.calculateEloChange(p1CurrentElo, p2CurrentElo, p1GameResult);
        p2EloChange = EloService.calculateEloChange(p2CurrentElo, p1CurrentElo, p2GameResult);

        // Update user ELO in database
        const p1NewElo = EloService.getNewElo(p1CurrentElo, p1EloChange);
        const p2NewElo = EloService.getNewElo(p2CurrentElo, p2EloChange);

        if (player1User) {
          await userRepository.updateElo(player1Id, p1NewElo);
        }
        if (player2User) {
          await userRepository.updateElo(player2Id, p2NewElo);
        }

        // Mark ELO as applied
        await gameService.markEloApplied(gameId);
      } else {
        // ELO already applied - recalculate for display only (don't update DB)
        const p1CurrentElo = player1User?.elo ?? 1200;
        const p2CurrentElo = player2User?.elo ?? 1200;
        // Subtract back the previously applied changes to get the original values
        // This ensures consistent display
        p1EloChange = EloService.calculateEloChange(p1CurrentElo, p2CurrentElo, p1GameResult);
        p2EloChange = EloService.calculateEloChange(p2CurrentElo, p1CurrentElo, p2GameResult);
      }

      gameEndResult = {
        player1_id: player1Id,
        player2_id: player2Id,
        player1_result: p1GameResult,
        player2_result: p2GameResult,
        player1_gems_lost: p1GemsLost,
        player2_gems_lost: p2GemsLost,
        winner_id: p1GameResult === 'WIN' ? player1Id : p2GameResult === 'WIN' ? player2Id : '',
        player1_elo_change: p1EloChange,
        player2_elo_change: p2EloChange,
      };
    }

    return {
      metadata: this.toDto(metadata),
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

  private throwHttpError(message: string, status: number): never {
    this.setStatus(status);
    const httpError = new Error(message) as Error & { status?: number };
    httpError.status = status;
    throw httpError;
  }
}
