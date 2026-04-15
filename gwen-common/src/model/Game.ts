import { PlayerRows } from './PlayerRows';
import { Player } from './Player';
import { Weather } from './Weather';
import { Datapack } from './Datapack';
import { THE_WITCHER_DATAPACK } from '../datapacks/the-witcher/WitcherDatapack';
import { GameResult } from '../types/GameResultType';
import type { RangeType } from '../types/RangeType';
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
      this.phase !== 'PLAY_CARDS'
    ) {
      throw new Error(`Cannot start round during phase: ${this.phase}`);
    }
    // Player 1 starts (TODO: use coin flip result to determine starter)
    this.currentPlayerTurnUserId = this.player1.getUserId();
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
    row.addCard(card as any); // Type assertion since UnitCard is expected

    // Remove card from hand
    player.getDeck().playCard(cardId);

    // Track the card as played this round
    const playedCards = this.lastCardsPlayedByUserId.get(userId) || [];
    playedCards.push(cardId);
    this.lastCardsPlayedByUserId.set(userId, playedCards);

    // Switch turn to other player
    this.currentPlayerTurnUserId = this.getOtherPlayerId(userId);
  }

  /**
   * Validate if a card can be placed on a row
   */
  private canCardBePlacedOnRow(card: PlayableCard, rowType: RangeType): boolean {
    // Check if card has range type (UnitCard)
    if ('hasRange' in card && typeof card.hasRange === 'function') {
      return (card as any).hasRange(rowType) || (card as any).hasRange('AGILE');
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
      // Switch turn to other player
      this.currentPlayerTurnUserId = this.getOtherPlayerId(userId);
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
   * TODO: Implement actual score calculation when card placement logic is ready
   */
  determineRoundResult(): void {
    const p1Score = this.player1Rows.updateScore();
    const p2Score = this.player2Rows.updateScore();

    let p1Result: GameResult;
    let p2Result: GameResult;

    if (p1Score > p2Score) {
      p1Result = GameResult.WIN;
      p2Result = GameResult.LOSS;
      this.roundsWonBy.set(
        this.player1.getUserId(),
        (this.roundsWonBy.get(this.player1.getUserId()) || 0) + 1,
      );
    } else if (p2Score > p1Score) {
      p1Result = GameResult.LOSS;
      p2Result = GameResult.WIN;
      this.roundsWonBy.set(
        this.player2.getUserId(),
        (this.roundsWonBy.get(this.player2.getUserId()) || 0) + 1,
      );
    } else {
      p1Result = GameResult.DRAW;
      p2Result = GameResult.DRAW;
    }

    this.lastRoundResult.set(this.player1.getUserId(), p1Result);
    this.lastRoundResult.set(this.player2.getUserId(), p2Result);

    // Check if game should end (first to 2 rounds wins)
    const p1Wins = this.roundsWonBy.get(this.player1.getUserId()) || 0;
    const p2Wins = this.roundsWonBy.get(this.player2.getUserId()) || 0;

    if (p1Wins >= 2 || p2Wins >= 2) {
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
   */
  private determineGameResult(): void {
    const p1Wins = this.roundsWonBy.get(this.player1.getUserId()) || 0;
    const p2Wins = this.roundsWonBy.get(this.player2.getUserId()) || 0;

    let p1Result: GameResult;
    let p2Result: GameResult;

    if (p1Wins > p2Wins) {
      p1Result = GameResult.WIN;
      p2Result = GameResult.LOSS;
    } else if (p2Wins > p1Wins) {
      p1Result = GameResult.LOSS;
      p2Result = GameResult.WIN;
    } else {
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
    // Clear board but keep hands
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
