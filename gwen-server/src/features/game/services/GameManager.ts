import { Game, Player, Deck, GwenConfig } from 'gwen-common';
import type { DBGame } from '../model/DBGame';
import type { UserFactionDeckService } from '../../auth/services/UserFactionDeckService.js';

export type GameWithMetadata = {
  metadata: DBGame;
  game: Game;
};

export class GameManager {
  private static instance: GameManager;
  private activeGames: Map<String, GameWithMetadata> = new Map();
  private userFactionDeckService: UserFactionDeckService | null = null;

  private constructor() {}

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setUserFactionDeckService(service: UserFactionDeckService): void {
    this.userFactionDeckService = service;
  }

  getUserFactionDeckService() {
    const maybeFactionDeckService = this.userFactionDeckService;
    if (!maybeFactionDeckService) {
      throw new Error('UserFactionDeckService not set on GameManager');
    }
    return maybeFactionDeckService;
  }

  public getActiveGameById = (gameId: string): GameWithMetadata => {
    const maybeGame = this.activeGames.get(gameId);
    if (!maybeGame) {
      throw new Error(`Active game with id ${gameId} not found`);
    }
    return maybeGame;
  };

  public async activateGame(game: DBGame): Promise<Game> {
    if (!game._id) {
      throw new Error('Game must have an _id to be activated');
    }

    const player1 = await this.initializePlayer(game.player1_id, game.player1_selected_deck_id);
    const player2 = await this.initializePlayer(game.player2_id, game.player2_selected_deck_id);

    const gameObj = new Game(player1, player2);

    this.activeGames.set(game._id?.toString() || '', {
      metadata: game,
      game: gameObj,
    });

    return gameObj;
  }

  async initializePlayer(playerId: string, selected_faction_id: string): Promise<Player> {
    // Fetch the player's selected deck from the database
    const selected_deck = await this.getUserFactionDeckService().getUserFactionDeck(
      playerId,
      selected_faction_id,
    );

    if (!selected_deck) {
      throw new Error(
        'Unable to fetch selected deck for user ' +
          playerId +
          ' with faction id ' +
          selected_faction_id,
      );
    }
    const datapackCardIndex = GwenConfig.getCurrentDatapackCardIndex();

    const cards = selected_deck.unit_card_ids.map((id) => {
      return datapackCardIndex.findPlayableCardById(id);
    });

    //TODO also shufle the cards

    const deck = new Deck();
    deck.setDrawPile(cards);

    const player = new Player(playerId);
    player.setDeck(deck);

    return player;
  }
}
