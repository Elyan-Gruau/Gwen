import type { Server, Socket } from 'socket.io';
import type { MatchmakingService } from './services/MatchmakingService.js';
import {
  MATCHMAKING_FOUND,
  MATCHMAKING_JOIN,
  MATCHMAKING_JOINED,
  MATCHMAKING_LEAVE,
  MATCHMAKING_LEFT,
} from 'gwen-common';

export class MatchmakingGateway {
  // Map: userId → Socket.id (to retrieve connections)
  private userSockets: Map<string, string> = new Map();

  constructor(
    private io: Server,
    private matchmakingService: MatchmakingService,
  ) {
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // User joins the matchmaking queue
      socket.on(MATCHMAKING_JOIN, async (data) => {
        const { userId, elo, faction } = data;

        this.userSockets.set(userId, socket.id);

        // Add user to the pool and search for opponent
        const match = await this.matchmakingService.joinPool(userId, elo, faction);

        socket.emit(MATCHMAKING_JOINED, {
          message: 'You are now in the queue',
          position: this.matchmakingService.getPoolSize(),
        });

        // If a match was found
        if (match) {
          this.notifyMatch(match);
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
      });

      // User disconnects
      socket.on('disconnect', async () => {
        // Find and remove the userId associated with this socket
        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            await this.matchmakingService.leavePool(userId);
            this.userSockets.delete(userId);
            console.log(`User disconnected: ${userId}`);
            break;
          }
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
