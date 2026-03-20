import { PlayerRows } from './PlayerRows';
import { Player } from './Player';
import { Weather } from './Weather';
import { Datapack } from './Datapack';
import { THE_WITCHER_DATAPACK } from '../datapacks/the-witcher/WitcherDatapack';

export class Game {
  private phase: GamePhase;
  private players: Player[];
  private playerRows: PlayerRows[];
  private weather: Weather;

  constructor(player1: Player, player2: Player) {
    const datapack = new Datapack(THE_WITCHER_DATAPACK);
    this.phase = 'WAITING_FOR_PLAYERS';
    this.players = [player1, player2];
    this.players[0].getDeck().addAllToHands(datapack.getFactions()[2].getUnits());
    this.playerRows = this.players.map((player) => new PlayerRows(player.getUserId()));
    this.weather = new Weather();
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

  getWeather(): Weather {
    return this.weather;
  }

  getPhase(): GamePhase {
    return this.phase;
  }
}

export type GamePhase = 'WAITING_FOR_PLAYERS' | 'REDRAW' | 'FLIP_COIN' | 'PLAY_CARDS' | 'END';
