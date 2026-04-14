import { PlayerRows } from './PlayerRows';
import { Player } from './Player';
import { Weather } from './Weather';
import { Datapack } from './Datapack';
import { THE_WITCHER_DATAPACK } from '../datapacks/the-witcher/WitcherDatapack';

export class Game {
  private phase: GamePhase;
  private player1: Player;
  private player2: Player;
  private player1Rows: PlayerRows;
  private player2Rows: PlayerRows;
  private weather: Weather;

  constructor(player1: Player, player2: Player) {
    this.phase = 'WAITING_FOR_PLAYERS';
    this.player1 = player1;
    this.player2 = player2;
    this.player1Rows = new PlayerRows(player1.getUserId());
    this.player2Rows = new PlayerRows(player2.getUserId());
    this.weather = new Weather();
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
}

export type GamePhase = 'WAITING_FOR_PLAYERS' | 'REDRAW' | 'FLIP_COIN' | 'PLAY_CARDS' | 'END';
