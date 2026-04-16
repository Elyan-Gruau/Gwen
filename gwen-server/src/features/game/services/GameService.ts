import { GameRepository } from '../repository/GameRepository.js';
import type { DBGame } from '../model/DBGame.js';

export class GameService {
  private gameRepository: GameRepository;

  constructor() {
    this.gameRepository = new GameRepository();
  }

  public async createGame(
    player1Id: string,
    player1DeckId: string,
    player2Id: string,
    player2DeckId: string,
  ): Promise<DBGame> {
    // Create a new game object for the database
    const newGame: DBGame = {
      player1_id: player1Id,
      player1_selected_deck_id: player1DeckId,
      player2_id: player2Id,
      player2_selected_deck_id: player2DeckId,
      status: 'ACTIVE',
      winner_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save the game to the database
    return await this.gameRepository.save(newGame);
  }

  public async getGame(gameId: string): Promise<DBGame | null> {
    return this.gameRepository.findById(gameId);
  }

  public async finishGame(gameId: string, winnerId: string): Promise<DBGame | null> {
    return this.gameRepository.update(gameId, {
      status: 'FINISHED',
      winner_id: winnerId,
      updated_at: new Date(),
    });
  }

  public async abandonGame(gameId: string): Promise<DBGame | null> {
    return this.gameRepository.update(gameId, { status: 'ABANDONED', updated_at: new Date() });
  }

  public async markEloApplied(gameId: string): Promise<void> {
    return this.gameRepository.markEloApplied(gameId);
  }

  public async checkEloApplied(gameId: string): Promise<boolean> {
    return this.gameRepository.hasEloBeenApplied(gameId);
  }

  public async getGameHistory(
    playerId: string,
    page: number,
    limit: number,
  ): Promise<{ content: DBGame[]; total: number }> {
    return this.gameRepository.findByPlayerId(playerId, { page, limit });
  }
}
