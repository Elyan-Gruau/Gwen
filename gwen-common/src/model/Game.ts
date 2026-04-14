import { PlayerRows } from './PlayerRows';
import { Player } from './Player';
import { Weather } from './Weather';
import { Datapack } from './Datapack';
import { THE_WITCHER_DATAPACK } from '../datapacks/the-witcher/WitcherDatapack';
import { GameResult } from '../types/GameResultType';

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

  getPlayer2Rows(): PlayerRows {
    return this.player2Rows;
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
      this.roundsWonBy.set(this.player1.getUserId(), (this.roundsWonBy.get(this.player1.getUserId()) || 0) + 1);
    } else if (p2Score > p1Score) {
      p1Result = GameResult.LOSS;
      p2Result = GameResult.WIN;
      this.roundsWonBy.set(this.player2.getUserId(), (this.roundsWonBy.get(this.player2.getUserId()) || 0) + 1);
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
    // TODO: Reset player hands and rows for new game
  }
}

export type GamePhase = 'WAITING_FOR_PLAYERS' | 'REDRAW' | 'FLIP_COIN' | 'PLAY_CARDS' | 'END';
