import { Body, Controller, Get, Path, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { GameService } from '../services/GameService.js';
import { GameManager, GameWithMetadata } from '../services/GameManager.js';
import type { DTOFinishGameRequest, DTOGame, DTOGameWithMetadata } from '../dtos/DTOGame.js';
import type { DBGame } from '../model/DBGame.js';
import { Player } from 'gwen-common';

const gameService = new GameService();

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

      return this.toDTOGameWithMetadata(gameWithMetadata);
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
    } catch (error) {
      return this.throwHttpError('Failed to retrieve game', 500);
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
    } catch (error) {
      return this.throwHttpError('Failed to finish game', 500);
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
    } catch (error) {
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

  private toDTOGameWithMetadata(gameWithMetadata: GameWithMetadata): DTOGameWithMetadata {
    const { metadata, game } = gameWithMetadata;
    return {
      metadata: this.toDto(metadata),
      game: {
        phase: game.getPhase(),
        player1: game.getPlayer1(),
        player2: game.getPlayer2(),
        player1Rows: game.getPlayer1Rows(),
        player2Rows: game.getPlayer2Rows(),
      },
    };
  }

  private throwHttpError(message: string, status: number): never {
    this.setStatus(status);
    const httpError = new Error(message) as Error & { status?: number };
    httpError.status = status;
    throw httpError;
  }
}
