import { PlayerRows } from './PlayerRows';
import { Player } from './Player';

export class Game {
  private phase: GamePhase;
  private players: Player[];
  private playerRows: PlayerRows[];

  constructor() {
    this.phase = 'WAITING_FOR_PLAYERS';
    this.players = [new Player('player1'), new Player('player2')];
    this.playerRows = this.players.map((player) => new PlayerRows(player.getUserId()));
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getPlayerRows(userId: string): PlayerRows {
    const maybePlayerRows = this.playerRows.find((pr) => pr.getUserId() === userId);
    if (!maybePlayerRows) {
      throw new Error(`Player rows for player with id ${userId} not found`);
    }
    return maybePlayerRows;
  }
}

export type GamePhase = 'WAITING_FOR_PLAYERS' | 'REDRAW' | 'FLIP_COIN' | 'PLAY_CARDS' | 'END';
