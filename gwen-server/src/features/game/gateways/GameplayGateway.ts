import type { Server, Socket } from 'socket.io';
import type { PlayableCard, PlayCardRequest, PlayCardResponse, Player } from 'gwen-common';
import { GAMEPLAY_EVENTS, UnitCard } from 'gwen-common';
import { GameManager } from '../services/GameManager.js';
import { GamePlayValidator } from '../services/GamePlayValidator.js';

export class GameplayGateway {
  private gameManager: GameManager;
  // Map: gameId → Set of socket.ids
  private gameRooms: Map<string, Set<string>> = new Map();

  constructor(private io: Server) {
    this.gameManager = GameManager.getInstance();
    this.setupListeners();
  }

  private setupListeners() {
    // Hook into existing connections (from matchmaking)
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected for gameplay: ${socket.id}`);

      // Join a game room
      socket.on('gameplay:join-game', (data: { gameId: string }) => {
        const { gameId } = data;
        socket.join(`game:${gameId}`);

        // Track the socket in the game room
        if (!this.gameRooms.has(gameId)) {
          this.gameRooms.set(gameId, new Set());
        }
        this.gameRooms.get(gameId)!.add(socket.id);

        console.log(`Socket ${socket.id} joined game ${gameId}`);
      });

      // Handle play card action
      socket.on(GAMEPLAY_EVENTS.PLAY_CARD, async (request: PlayCardRequest) => {
        await this.handlePlayCard(socket, request);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Gameplay socket disconnected: ${socket.id}`);
        // Clean up from game rooms
        for (const [gameId, sockets] of this.gameRooms) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            this.gameRooms.delete(gameId);
          }
        }
      });
    });
  }

  private async handlePlayCard(socket: Socket, request: PlayCardRequest) {
    try {
      const { gameId, cardId, rowType } = request;

      // Get the active game
      const gameWithMetadata = this.gameManager.getActiveGameById(gameId);
      const { game } = gameWithMetadata;

      // TODO: Determine which player is making the move (use socket authentication)
      // For now, infer the player from the card presence in hand
      const allPlayers = game.getPlayers();
      const playingPlayer = this.findPlayerOwningCard(allPlayers, cardId);

      // Validate the move
      const validation = GamePlayValidator.validatePlayCard(game, playingPlayer, request);

      if (!validation.valid) {
        const response: PlayCardResponse = {
          success: false,
          message: validation.error || 'Invalid move',
        };
        socket.emit(GAMEPLAY_EVENTS.PLAY_CARD_RESPONSE, response);
        return;
      }

      // Apply the move to the game state
      // 1. Remove the card from the player's hand
      const deck = playingPlayer.getDeck();
      const playedCard = deck.findCardInHandById(cardId);
      deck.playCard(cardId);

      // 2. Place it on the board in the specified row (only UnitCards can be placed on a row)
      if (playedCard instanceof UnitCard) {
        const playerRows = game.getPlayerRows(playingPlayer.getUserId());
        const targetRow = playerRows.getRow(rowType);
        targetRow.addCard(playedCard);
        // Update scores after the card is placed
        playerRows.updateScore();
      } else {
        // For now, non-unit cards are simply discarded (TODO: handle specials properly)
        deck.getDiscarded().push(playedCard);
      }

      // Send success response
      const response: PlayCardResponse = {
        success: true,
        message: 'Card played successfully',
      };
      socket.emit(GAMEPLAY_EVENTS.PLAY_CARD_RESPONSE, response);

      // Broadcast updated game state to all players in the room
      this.io.to(`game:${gameId}`).emit(GAMEPLAY_EVENTS.GAME_STATE_UPDATED, {
        game: {
          phase: game.getPhase(),
          player1: game.getPlayer1(),
          player2: game.getPlayer2(),
          player1Rows: game.getPlayer1Rows(),
          player2Rows: game.getPlayer2Rows(),
        },
      });
    } catch (error) {
      console.error('Error handling play card:', error);
      const response: PlayCardResponse = {
        success: false,
        message: 'Server error',
      };
      socket.emit(GAMEPLAY_EVENTS.PLAY_CARD_RESPONSE, response);
    }
  }

  /**
   * Finds the player whose hand currently contains the given card id.
   * Falls back to the first player if no direct match is found.
   */
  private findPlayerOwningCard(players: Player[], cardId: string): Player {
    for (const player of players) {
      const hand = player.getDeck().getHand();
      if (hand.some((card: PlayableCard) => card.getId() === cardId)) {
        return player;
      }
    }

    // Fallback: return first player (should not normally happen)
    return players[0];
  }
}
