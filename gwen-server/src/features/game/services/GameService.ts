import { GameRepository } from '../repository/GameRepository.js';
import type { DBGame } from '../model/DBGame.js';

export class GameService {
  private gameRepository: GameRepository;

  constructor() {
    this.gameRepository = new GameRepository();
  }

  public async createGame(player1Id: string, player2Id: string): Promise<{ _id: string }> {
    // Create a new game object for the database
    const newGame: DBGame = {
      player1_id: player1Id,
      player2_id: player2Id,
      status: 'ACTIVE',
      winner_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save the game to the database
    const savedGame = await this.gameRepository.save(newGame);

    // Return the game ID
    return { _id: String(savedGame._id) };
  }

  public async getGame(gameId: string): Promise<DBGame | null> {
    return this.gameRepository.findById(gameId);
  }

  public async finishGame(gameId: string, winnerId: string): Promise<DBGame | null> {
    return this.gameRepository.update(gameId, { status: 'FINISHED', winner_id: winnerId });
  }

  public async abandonGame(gameId: string): Promise<DBGame | null> {
    return this.gameRepository.update(gameId, { status: 'ABANDONED' });
  }
}
