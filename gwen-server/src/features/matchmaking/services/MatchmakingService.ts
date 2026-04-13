import type { UserService } from '../../auth/services/UserService.js';
import type { GameService } from '../../game/services/GameService.js';
import { GameManager } from '../../game/services/GameManager';

export class MatchmakingService {
  // Map: userId → { userId, elo, timestamp, deckId }
  private readonly matchmakingPool: Map<
    string,
    { userId: string; elo: number; timestamp: number; deckId?: string }
  > = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  async joinPool(userId: string, elo: number, deckId?: string) {
    // Add user to the pool
    this.matchmakingPool.set(userId, {
      userId,
      elo,
      timestamp: Date.now(),
      deckId,
    });

    // Search for opponent
    const opponent = this.findOpponent(userId, elo);

    if (opponent) {
      // Remove both from pool
      this.matchmakingPool.delete(userId);
      this.matchmakingPool.delete(opponent.userId);

      // Create game
      const game = await this.gameService.createGame(
        userId,
        deckId || '',
        opponent.userId,
        opponent.deckId || '',
      );
      GameManager.getInstance().activateGame(game);

      return {
        player1: userId,
        player2: opponent.userId,
        gameId: game._id?.toString() || '',
      };
    }

    return null;
  }

  private findOpponent(userId: string, userElo: number, eloRange: number = 100) {
    // Search for someone with similar ELO
    for (const [, opponent] of this.matchmakingPool) {
      if (opponent.userId !== userId && Math.abs(opponent.elo - userElo) <= eloRange) {
        return opponent;
      }
    }
    return null;
  }

  async leavePool(userId: string) {
    this.matchmakingPool.delete(userId);
  }

  getPoolSize(): number {
    return this.matchmakingPool.size;
  }
}
