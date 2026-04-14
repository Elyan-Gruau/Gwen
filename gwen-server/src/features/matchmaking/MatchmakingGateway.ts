import type { Server, Socket } from 'socket.io';
import type { MatchmakingService } from './services/MatchmakingService.js';
import type { UserService } from '../auth/services/UserService.js';
import type { UserFactionDeckService } from '../auth/services/UserFactionDeckService.js';
import { GameManager } from '../game/services/GameManager.js';
import {
  MATCHMAKING_FOUND,
  MATCHMAKING_JOIN,
  MATCHMAKING_JOINED,
  MATCHMAKING_LEAVE,
  MATCHMAKING_LEFT,
  MATCHMAKING_POOL_SIZE,
} from 'gwen-common';

export class MatchmakingGateway {
  // Map: userId → Socket.id (to retrieve connections)
  private userSockets: Map<string, string> = new Map();
  private gameManager: GameManager;

  constructor(
    private io: Server,
    private matchmakingService: MatchmakingService,
    private userService: UserService,
    private userFactionDeckService: UserFactionDeckService,
  ) {
    this.gameManager = GameManager.getInstance();
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // User joins the matchmaking queue
      socket.on(MATCHMAKING_JOIN, async (data) => {
        const { userId, deckId } = data;

        try {
          // Fetch user from database to get their ELO
          const user = await this.userService.getUserById(userId);

          if (!user) {
            socket.emit('error', { message: 'User not found' });
            return;
          }

          // Check if user has at least one valid deck
          const hasValidDeck = await this.userFactionDeckService.hasValidDeck(userId);
          if (!hasValidDeck) {
            socket.emit('error', {
              message: 'You must have at least one valid deck to play',
              code: 'NO_VALID_DECK',
            });
            return;
          }

          const userElo = user.elo;

          this.userSockets.set(userId, socket.id);

          // Add user to the pool and search for opponent
          const match = await this.matchmakingService.joinPool(userId, userElo, deckId);

          // Calculate position in queue
          const poolSize = this.matchmakingService.getPoolSize();
          const position = poolSize + 1;

          socket.emit(MATCHMAKING_JOINED, {
            message: 'You are now in the queue',
            position: position,
          });

          // Broadcast the updated pool size to all connected clients
          this.io.emit(MATCHMAKING_POOL_SIZE, {
            size: poolSize + 1,
          });

          // If a match was found
          if (match) {
            this.notifyMatch(match);
          }
        } catch (error) {
          console.error('Error joining matchmaking pool:', error);
          socket.emit('error', { message: 'Failed to join matchmaking pool' });
        }
      });

      // User leaves the queue
      socket.on(MATCHMAKING_LEAVE, async (data) => {
        const { userId } = data;

        await this.matchmakingService.leavePool(userId);
        this.userSockets.delete(userId);

        socket.emit(MATCHMAKING_LEFT, {
          message: 'You have left the queue',
        });

        // Broadcast the updated pool size to all connected clients
        this.io.emit(MATCHMAKING_POOL_SIZE, {
          size: this.matchmakingService.getPoolSize(),
        });
      });

      // User disconnects
      socket.on('disconnect', async () => {
        let foundUser = false;

        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            await this.matchmakingService.leavePool(userId);
            this.userSockets.delete(userId);
            console.log(`User disconnected and removed from pool: ${userId}`);
            foundUser = true;
            break;
          }
        }

        if (!foundUser) {
          console.log(`Socket disconnected without active matchmaking entry: ${socket.id}`);
        }
      });
    });
  }

  private notifyMatch(match: { player1: string; player2: string; gameId: string }) {
    const socketId1 = this.userSockets.get(match.player1);
    const socketId2 = this.userSockets.get(match.player2);

    if (socketId1) {
      this.io.to(socketId1).emit(MATCHMAKING_FOUND, {
        opponentId: match.player2,
        gameId: match.gameId,
        message: 'Match found! An opponent is waiting for you...',
      });
    }

    if (socketId2) {
      this.io.to(socketId2).emit(MATCHMAKING_FOUND, {
        opponentId: match.player1,
        gameId: match.gameId,
        message: 'Match found! An opponent is waiting for you...',
      });
    }
  }
}
