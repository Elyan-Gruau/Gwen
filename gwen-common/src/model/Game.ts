import { PlayerRows } from './PlayerRows';
import { Player } from './Player';
import { Weather } from './Weather';
import type { UnitCard } from './cards/UnitCard';
import { GameResult } from '../types/GameResultType';
import type { RangeType, UnitsRangeType } from '../types/RangeType';
import type { PlayableCard } from '../types/Card';

export class Game {
  private phase: GamePhase;
  private player1: Player;
  private player2: Player;
  private player1Rows: PlayerRows;
  private player2Rows: PlayerRows;
  private weather: Weather;
  private currentRound: number;
  private roundsWonBy: Map<string, number>; // userId -> rounds won
  private lastRoundResult: Map<string, GameResult>; // userId -> their result (WIN/LOSS/DRAW)
  private lastRoundWinnerId: string | null; // userId of who won last round (null if draw)
  private gameResult: Map<string, GameResult> | null; // null until game ends, then userId -> result
  private currentPlayerTurnUserId: string | null; // null until round starts, then alternates
  private lastCardsPlayedByUserId: Map<string, string[]>; // userId -> cardIds played this round

  constructor(player1: Player, player2: Player) {
    this.phase = 'WAITING_FOR_PLAYERS';
    this.player1 = player1;
    this.player2 = player2;
    this.player1Rows = new PlayerRows(player1.getUserId());
    this.player2Rows = new PlayerRows(player2.getUserId());
    this.weather = new Weather();
    this.currentRound = 1;
    this.roundsWonBy = new Map([
      [player1.getUserId(), 0],
      [player2.getUserId(), 0],
    ]);
    this.lastRoundResult = new Map();
    this.lastRoundWinnerId = null;
    this.gameResult = null;
    this.currentPlayerTurnUserId = null;
    this.lastCardsPlayedByUserId = new Map([
      [player1.getUserId(), []],
      [player2.getUserId(), []],
    ]);
  }

  getPlayers(): Player[] {
    return [this.player1, this.player2];
  }

  getAllPlayerRows(): PlayerRows[] {
    return [this.player1Rows, this.player2Rows];
  }

  getPlayerRows(userId: string): PlayerRows {
    const maybePlayerRows = this.getAllPlayerRows().find((pr) => pr.getUserId() === userId);
    if (!maybePlayerRows) {
      throw new Error(`Player rows for player with id ${userId} not found`);
    }
    return maybePlayerRows;
  }

  getWeather(): Weather {
    return this.weather;
  }

  getPhase(): GamePhase {
    return this.phase;
  }

  getCurrentRound(): number {
    return this.currentRound;
  }

  getRoundsWon(userId: string): number {
    return this.roundsWonBy.get(userId) || 0;
  }

  /**
   * Get the result of the last completed round for a specific player
   * Returns null if no round has ended yet
   */
  getLastRoundResult(userId: string): GameResult | null {
    return this.lastRoundResult.get(userId) || null;
  }

  /**
   * Check if a round has just ended
   */
  isRoundJustEnded(): boolean {
    return this.lastRoundResult.size > 0;
  }

  /**
   * Get the winner of the last round (null if draw or no round ended yet)
   */
  getLastRoundWinnerId(): string | null {
    return this.lastRoundWinnerId;
  }

  /**
   * Restore round result from DTO (used when reconstructing game state from server)
   */
  restoreRoundResult(
    player1Id: string,
    p1Result: GameResult,
    player2Id: string,
    p2Result: GameResult,
    winnerId: string | null,
  ): void {
    this.lastRoundResult.set(player1Id, p1Result);
    this.lastRoundResult.set(player2Id, p2Result);
    this.lastRoundWinnerId = winnerId;
  }

  /**
   * Restore game result from DTO (used when reconstructing game state from server)
   */
  restoreGameResult(
    player1Id: string,
    p1Result: GameResult,
    player2Id: string,
    p2Result: GameResult,
  ): void {
    this.gameResult = new Map([
      [player1Id, p1Result],
      [player2Id, p2Result],
    ]);
    this.phase = 'END';
  }

  /**
   * Clear round result after it's been displayed
   */
  clearRoundResult(): void {
    this.lastRoundResult.clear();
  }

  /**
   * Get the final game result for a specific player (null if game not ended)
   */
  getGameResult(userId: string): GameResult | null {
    if (!this.gameResult) return null;
    return this.gameResult.get(userId) || null;
  }

  /**
   * Check if the game has ended
   */
  isGameEnded(): boolean {
    return this.phase === 'END';
  }

  getPlayer1(): Player {
    return this.player1;
  }

  getPlayer2(): Player {
    return this.player2;
  }

  getPlayer1Rows(): PlayerRows {
    return this.player1Rows;
  }

  setPlayer1Rows(newPlayerRows: PlayerRows) {
    this.player1Rows = newPlayerRows;
  }

  getPlayer2Rows(): PlayerRows {
    return this.player2Rows;
  }

  setPlayer2Rows(newPlayerRows: PlayerRows) {
    this.player2Rows = newPlayerRows;
  }

  /**
   * Get the player whose turn it is (null if round hasn't started)
   */
  getCurrentPlayerTurnUserId(): string | null {
    return this.currentPlayerTurnUserId;
  }

  /**
   * Check if a specific player has passed this round
   */
  hasPlayerPassed(userId: string): boolean {
    if (userId === this.player1.getUserId()) {
      return this.player1.hasPassed();
    } else if (userId === this.player2.getUserId()) {
      return this.player2.hasPassed();
    }
    return false;
  }

  /**
   * Get the opponent's ID
   */
  private getOtherPlayerId(userId: string): string {
    if (userId === this.player1.getUserId()) {
      return this.player2.getUserId();
    } else if (userId === this.player2.getUserId()) {
      return this.player1.getUserId();
    }
    throw new Error(`Player with id ${userId} not found in game`);
  }

  /**
   * Get the opponent Player instance
   */
  private getOtherPlayer(userId: string): Player {
    if (userId === this.player1.getUserId()) {
      return this.player2;
    } else if (userId === this.player2.getUserId()) {
      return this.player1;
    }
    throw new Error(`Player with id ${userId} not found in game`);
  }

  /**
   * Start a round - player 1 goes first (or player 2 if alternating)
   * TODO: Implement coin flip to determine who starts
   */
  startRound(): void {
    if (
      this.phase !== 'WAITING_FOR_PLAYERS' &&
      this.phase !== 'FLIP_COIN' &&
      this.phase !== 'REDRAW' &&
      this.phase !== 'PLAY_CARDS'
    ) {
      throw new Error(`Cannot start round during phase: ${this.phase}`);
    }
    // Round winner starts next round, or player1 if it's the first round or a draw
    if (this.lastRoundWinnerId) {
      this.currentPlayerTurnUserId = this.lastRoundWinnerId;
    } else {
      this.currentPlayerTurnUserId = this.player1.getUserId();
    }
    this.phase = 'PLAY_CARDS';
    // Reset pass status for new round
    this.player1.resetPass();
    this.player2.resetPass();
  }

  /**
   * Check if both players have passed
   */
  private haveBothPlayersPassed(): boolean {
    return this.player1.hasPassed() && this.player2.hasPassed();
  }

  /**
   * Place a card on the board for the current player
   * @throws if not player's turn, card not found, or invalid placement
   */
  placeCard(userId: string, cardId: string, rowType: RangeType): void {
    if (this.phase !== 'PLAY_CARDS') {
      throw new Error(`Cannot place card during phase: ${this.phase}`);
    }

    if (userId !== this.currentPlayerTurnUserId) {
      throw new Error(`Not your turn. Current turn: ${this.currentPlayerTurnUserId}`);
    }

    const player = userId === this.player1.getUserId() ? this.player1 : this.player2;

    // Cannot place card if player has already passed
    if (player.hasPassed()) {
      throw new Error(`Cannot place card after passing`);
    }

    const playerRows = userId === this.player1.getUserId() ? this.player1Rows : this.player2Rows;

    // Validate card exists in player's hand
    const hand = player.getDeck().getHand();
    const card = hand.find((c) => c.getId() === cardId);
    if (!card) {
      throw new Error(`Card ${cardId} not found in player's hand`);
    }

    // Validate card can be placed on this row
    const canPlaceCard = this.canCardBePlacedOnRow(card, rowType);
    if (!canPlaceCard) {
      throw new Error(`Card ${cardId} cannot be placed on ${rowType} row`);
    }

    // Place the card on the row
    const row = playerRows.getRowByType(rowType);
    row.addCard(card as UnitCard);

    // Remove card from hand
    player.getDeck().playCard(cardId);

    // Track the card as played this round
    const playedCards = this.lastCardsPlayedByUserId.get(userId) || [];
    playedCards.push(cardId);
    this.lastCardsPlayedByUserId.set(userId, playedCards);

    // Switch turn logic: if other player has passed, keep turn with current player
    const otherPlayerId = this.getOtherPlayerId(userId);
    const otherPlayer = otherPlayerId === this.player1.getUserId() ? this.player1 : this.player2;

    if (otherPlayer.hasPassed()) {
      // Other player passed, keep turn with current player
      this.currentPlayerTurnUserId = userId;
    } else {
      // Other player hasn't passed, give them the turn
      this.currentPlayerTurnUserId = otherPlayerId;
    }
  }

  /**
   * Validate if a card can be placed on a row
   * - Regular cards can be placed on their designated row type
   * - AGILE cards can be placed on MELEE or RANGED rows (but not SIEGE)
   * - Modifier cards can be placed on any row
   */
  private canCardBePlacedOnRow(card: PlayableCard, rowType: RangeType): boolean {
    // Check if card has range type (UnitCard)
    if ('hasRange' in card && typeof card.hasRange === 'function') {
      const unitCard = card as { hasRange: (range: UnitsRangeType) => boolean };

      // Check if card has exact row type (MELEE, RANGED, or SIEGE)
      if (unitCard.hasRange(rowType)) {
        return true;
      }

      // Check if card is AGILE and row is MELEE or RANGED (AGILE cannot go on SIEGE)
      if (unitCard.hasRange('AGILE') && (rowType === 'MELEE' || rowType === 'RANGED')) {
        return true;
      }

      return false;
    }
    // RowModifierCard and other types can be placed on any row
    return true;
  }

  /**
   * Pass turn (player skips their turn)
   * If both players pass, end the round
   */
  passTurn(userId: string): void {
    if (this.phase !== 'PLAY_CARDS') {
      throw new Error(`Cannot pass during phase: ${this.phase}`);
    }

    if (userId !== this.currentPlayerTurnUserId) {
      throw new Error(`Not your turn. Current turn: ${this.currentPlayerTurnUserId}`);
    }

    const player = userId === this.player1.getUserId() ? this.player1 : this.player2;
    player.pass();

    // Check if this ends the round
    if (this.haveBothPlayersPassed()) {
      this.endRound();
    } else {
      // Other player hasn't passed, give them continuous turns
      this.currentPlayerTurnUserId = this.getOtherPlayerId(userId);
    }
  }

  /**
   * Auto-pass a player when they have no cards left in hand
   */
  autoPassIfNoCards(userId: string): void {
    const player = userId === this.player1.getUserId() ? this.player1 : this.player2;

    // Only auto-pass if they haven't already passed and have no cards
    if (!player.hasPassed() && player.getDeck().getHand().length === 0) {
      player.pass();

      // If it's their turn and they're auto-passed, skip to next turn
      if (userId === this.currentPlayerTurnUserId) {
        if (this.haveBothPlayersPassed()) {
          this.endRound();
        } else {
          // Switch to other player
          this.currentPlayerTurnUserId = this.getOtherPlayerId(userId);
        }
      }
    }
  }

  /**
   * End the current round and score it
   */
  endRound(): void {
    if (this.phase !== 'PLAY_CARDS') {
      throw new Error('Cannot end round that is not in PLAY_CARDS phase');
    }

    this.determineRoundResult();
  }

  /**
   * Calculate round result after round ends
   * This is called when both players have passed
   * Determines winner by score and updates gem counts
   * Game ends when any player reaches 0 gems
   */
  determineRoundResult(): void {
    const p1Score = this.player1Rows.updateScore();
    const p2Score = this.player2Rows.updateScore();

    let p1Result: GameResult;
    let p2Result: GameResult;

    if (p1Score > p2Score) {
      p1Result = GameResult.WIN;
      p2Result = GameResult.LOSS;
      this.lastRoundWinnerId = this.player1.getUserId();
      // Loser loses a gem
      this.player2.loseGem();
    } else if (p2Score > p1Score) {
      p1Result = GameResult.LOSS;
      p2Result = GameResult.WIN;
      this.lastRoundWinnerId = this.player2.getUserId();
      // Loser loses a gem
      this.player1.loseGem();
    } else {
      p1Result = GameResult.DRAW;
      p2Result = GameResult.DRAW;
      this.lastRoundWinnerId = null;
      // Both lose a gem on draw
      this.player1.loseGem();
      this.player2.loseGem();
    }

    this.lastRoundResult.set(this.player1.getUserId(), p1Result);
    this.lastRoundResult.set(this.player2.getUserId(), p2Result);

    // Check if game should end (when any player has 0 gems)
    if (!this.player1.hasGems() || !this.player2.hasGems()) {
      this.determineGameResult();
    } else {
      // Prepare for next round
      this.currentRound++;
      this.phase = 'REDRAW';
      this.resetRoundState();
    }
  }

  /**
   * Determine final game result and transition to END phase
   * Winner is determined by who still has gems
   */
  private determineGameResult(): void {
    let p1Result: GameResult;
    let p2Result: GameResult;

    // Player with gems wins, player without gems loses
    if (this.player1.hasGems() && !this.player2.hasGems()) {
      p1Result = GameResult.WIN;
      p2Result = GameResult.LOSS;
    } else if (!this.player1.hasGems() && this.player2.hasGems()) {
      p1Result = GameResult.LOSS;
      p2Result = GameResult.WIN;
    } else {
      // Both have gems or both have no gems (shouldn't happen in normal play)
      p1Result = GameResult.DRAW;
      p2Result = GameResult.DRAW;
    }

    this.gameResult = new Map([
      [this.player1.getUserId(), p1Result],
      [this.player2.getUserId(), p2Result],
    ]);

    this.phase = 'END';
  }

  /**
   * Reset state for next round
   * TODO: Handle card redraw logic
   */
  private resetRoundState(): void {
    // Move board cards to the discard pile
    const p1Deck = this.player1.getDeck();
    const p2Deck = this.player2.getDeck();

    this.player1Rows.getAllRows().forEach((row) => {
      const cards = row.getCards();
      if (cards.length > 0) {
        p1Deck.getDiscarded().push(...cards);
        cards.length = 0;
      }
    });
    this.player2Rows.getAllRows().forEach((row) => {
      const cards = row.getCards();
      if (cards.length > 0) {
        p2Deck.getDiscarded().push(...cards);
        cards.length = 0;
      }
    });

    // Reset the lines
    this.player1Rows = new PlayerRows(this.player1.getUserId());
    this.player2Rows = new PlayerRows(this.player2.getUserId());
    this.currentPlayerTurnUserId = null;
    this.player1.resetPass();
    this.player2.resetPass();
    this.lastCardsPlayedByUserId.set(this.player1.getUserId(), []);
    this.lastCardsPlayedByUserId.set(this.player2.getUserId(), []);
    // TODO: Handle card redraw/mulligan phase
  }

  /**
   * Resign from the game: the resigning player loses, the opponent wins
   */
  resign(resigningPlayerId: string): void {
    const opponentId = this.getOtherPlayerId(resigningPlayerId);

    this.gameResult = new Map([
      [resigningPlayerId, GameResult.LOSS],
      [opponentId, GameResult.WIN],
    ]);

    this.phase = 'END';
  }

  /**
   * Start a rematch - reset all game state
   */
  rematch(): void {
    this.phase = 'WAITING_FOR_PLAYERS';
    this.currentRound = 1;
    this.roundsWonBy = new Map([
      [this.player1.getUserId(), 0],
      [this.player2.getUserId(), 0],
    ]);
    this.lastRoundResult.clear();
    this.gameResult = null;
    this.currentPlayerTurnUserId = null;
    this.lastCardsPlayedByUserId.set(this.player1.getUserId(), []);
    this.lastCardsPlayedByUserId.set(this.player2.getUserId(), []);
    this.player1.resetPass();
    this.player2.resetPass();
    // TODO: Reset player hands and rows for new game
  }
}

export type GamePhase = 'WAITING_FOR_PLAYERS' | 'REDRAW' | 'FLIP_COIN' | 'PLAY_CARDS' | 'END';
