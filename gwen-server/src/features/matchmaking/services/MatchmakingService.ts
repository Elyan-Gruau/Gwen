import type { UserService } from '../../auth/services/UserService.js';
import type { GameService } from '../../game/services/GameService.js';
import type { UserFactionDeckService } from '../../auth/services/UserFactionDeckService.js';
import { GameManager } from '../../game/services/GameManager';

export class MatchmakingService {
  // Map: userId → { userId, elo, timestamp, deckId }
  private readonly matchmakingPool: Map<
    string,
    { userId: string; elo: number; timestamp: number; deckId?: string }
  > = new Map();
  private matchCheckInterval: NodeJS.Timeout | null = null;
  private onMatchFound: ((match: { player1: string; player2: string; gameId: string }) => Promise<void>) | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly userFactionDeckService: UserFactionDeckService,
  ) {
    // Set the UserFactionDeckService on GameManager singleton
    GameManager.getInstance().setUserFactionDeckService(userFactionDeckService);
    this.startMatchCheckInterval();
  }

  private startMatchCheckInterval() {
    // Check for matches every 2 seconds
    this.matchCheckInterval = setInterval(() => {
      this.checkForMatches().catch((error) =>
        console.error('Error checking for matches:', error),
      );
    }, 2000);
  }

  stopMatchCheckInterval() {
    if (this.matchCheckInterval) {
      clearInterval(this.matchCheckInterval);
      this.matchCheckInterval = null;
    }
  }

  setOnMatchFoundCallback(callback: (match: { player1: string; player2: string; gameId: string }) => Promise<void>) {
    this.onMatchFound = callback;
  }

  private async checkForMatches() {
    const processedUsers = new Set<string>();

    for (const [userId] of this.matchmakingPool) {
      if (processedUsers.has(userId)) continue;

      const userEntry = this.matchmakingPool.get(userId);
      if (!userEntry) continue;

      const opponent = this.findOpponentWithExpandingRange(userId);

      if (opponent) {
        processedUsers.add(userId);
        processedUsers.add(opponent.userId);

        // Remove both from pool
        this.matchmakingPool.delete(userId);
        this.matchmakingPool.delete(opponent.userId);

        try {
          // Create game
          const deckId = userEntry.deckId || '';
          const opponentDeckId = opponent.deckId || '';

          console.log('Creating game from periodic check...');
          const game = await this.gameService.createGame(userId, deckId, opponent.userId, opponentDeckId);
          console.log('Game created with id: ', game._id?.toString());

          const activatedGame = await GameManager.getInstance().activateGame(game);
          console.log('Game activated');

          const match = {
            player1: userId,
            player2: opponent.userId,
            gameId: game._id?.toString() || '',
          };

          if (this.onMatchFound) {
            await this.onMatchFound(match);
          }
        } catch (error) {
          console.error('Error creating game from periodic check:', error);
          // Re-add users to pool on error
          this.matchmakingPool.set(userId, userEntry);
          this.matchmakingPool.set(opponent.userId, opponent);
        }
      }
    }
  }

  async joinPool(userId: string, elo: number, deckId?: string) {
    // Add user to the pool
    const timestamp = Date.now();
    this.matchmakingPool.set(userId, {
      userId,
      elo,
      timestamp,
      deckId,
    });

    // Try to find an opponent immediately
    const opponent = this.findOpponentWithExpandingRange(userId);

    if (opponent) {
      // Remove both from pool
      this.matchmakingPool.delete(userId);
      this.matchmakingPool.delete(opponent.userId);

      // Create game
      console.log('Creating game ...');
      const game = await this.gameService.createGame(
        userId,
        deckId || '',
        opponent.userId,
        opponent.deckId || '',
      );
      console.log('Game created with id: ', game._id?.toString());

      const activatedGame = await GameManager.getInstance().activateGame(game);
      console.log('Game activated');

      return {
        player1: userId,
        player2: opponent.userId,
        gameId: game._id?.toString() || '',
      };
    }

    return null;
  }

  /**
   * Get the current ELO search range for a user
   * Returns min and max ELO within the search range
   */
  getSearchRange(userId: string): { minElo: number; maxElo: number; range: number } | null {
    const user = this.matchmakingPool.get(userId);
    if (!user) return null;

    const searchTimeMs = Date.now() - user.timestamp;
    const range = 100 + Math.floor(searchTimeMs / 10000) * 50;

    return {
      minElo: Math.max(0, user.elo - range),
      maxElo: user.elo + range,
      range,
    };
  }

  private findOpponent(userId: string, userElo: number, searchTimeMs: number = 0) {
    // Expand ELO range over time: start at 100, increase by 50 every 10 seconds, no limit
    // searchTimeMs is time searched in milliseconds
    const eloRange = 100 + Math.floor(searchTimeMs / 10000) * 50;

    // Search for someone with similar ELO
    for (const [, opponent] of this.matchmakingPool) {
      if (opponent.userId !== userId && Math.abs(opponent.elo - userElo) <= eloRange) {
        return opponent;
      }
    }
    return null;
  }

  /**
   * Find an opponent by checking each user's individual search time
   * This ensures matches can be found as search ranges expand over time
   */
  private findOpponentWithExpandingRange(userId: string) {
    const user = this.matchmakingPool.get(userId);
    if (!user) return null;

    const now = Date.now();
    const userSearchTimeMs = now - user.timestamp;
    const userEloRange = 100 + Math.floor(userSearchTimeMs / 5000) * 100;

    // Search through all other users
    for (const [opponentId, opponent] of this.matchmakingPool) {
      if (opponentId === userId) continue;

      // Calculate opponent's search time
      const opponentSearchTimeMs = now - opponent.timestamp;
      const opponentEloRange = 100 + Math.floor(opponentSearchTimeMs / 10000) * 50;

      const eloDifference = Math.abs(opponent.elo - user.elo);

      // Both users must accept this match (within each other's range)
      if (eloDifference <= userEloRange && eloDifference <= opponentEloRange) {
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
