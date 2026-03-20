import { Game, Player } from 'gwen-common';
import { DBGame } from '../model/DBGame';

export type GameWithMetadata = {
  metadata: DBGame;
  game: Game;
};

export class GameManager {
  private static instance: GameManager;
  private activeGames: Map<String, GameWithMetadata> = new Map();

  private constructor() {}

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public getActiveGameById = (gameId: string): GameWithMetadata => {
    const maybeGame = this.activeGames.get(gameId);
    if (!maybeGame) {
      throw new Error(`Active game with id ${gameId} not found`);
    }
    return maybeGame;
  };

  public activateGame(game: DBGame) {
    if (!game._id) {
      throw new Error('Game must have an _id to be activated');
    }

    const player1 = new Player(game.player1_id);
    const player2 = new Player(game.player2_id);

    const gameObj = new Game(player1, player2);
    this.activeGames.set(game._id?.toString() || '', {
      metadata: game,
      game: gameObj,
    });
  }
}
