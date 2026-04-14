import type { DTOGameWithMetadataGame } from 'gwen-generated-api';
import { Deck, Game, GwenConfig, Player } from 'gwen-common';

export abstract class GameMapper {
  static toModel(dto: DTOGameWithMetadataGame): Game {
    // Map players from DTO to domain model
    const player1 = this.mapPlayer(dto.player1 as any);
    const player2 = this.mapPlayer(dto.player2 as any);

    const game = new Game(player1, player2);
    // NOTE: Game phase and rows are currently initialized internally by Game's constructor.
    // If we later add setters on Game for phase/rows, we can also map dto.phase and dto.player*Rows here.
    return game;
  }

  private static mapPlayer(dtoPlayer: any): Player {
    console.log({ dtoPlayer });
    const cardIndex = GwenConfig.getCurrentDatapackCardIndex();

    const dtoDeck = dtoPlayer.deck as any | undefined;

    // Resolve leader card id from the DTO
    const leaderIdFromDeck = dtoDeck?.leader?.id as string | undefined;
    const leaderIdFromPlayer =
      typeof dtoPlayer.leaderId === 'string' ? dtoPlayer.leaderId : undefined;
    const leaderIdFromCompressed = typeof dtoPlayer.c === 'string' ? dtoPlayer.c : undefined;

    const leaderId = leaderIdFromDeck ?? leaderIdFromPlayer ?? leaderIdFromCompressed;

    if (!leaderId) {
      throw new Error('Unable to resolve leader id from DTO player');
    }

    // Find corresponding LeaderCard instance in the shared datapack index
    const leaderCard = cardIndex.findLeaderCardById(leaderId);

    // Rebuild deck from card ids using the shared datapack index
    const deck = new Deck(leaderCard);

    const mapCards = (cards: any[] | undefined) => {
      if (!Array.isArray(cards)) return [];
      return cards
        .map((raw) => {
          const id = (raw as any)?.id as string | undefined;
          if (!id) return null;
          try {
            return cardIndex.findPlayableCardById(id);
          } catch {
            // If a card is not found in the index, just ignore it on the client
            return null;
          }
        })
        .filter((c): c is ReturnType<typeof cardIndex.findPlayableCardById> => c !== null);
    };

    // Draw pile
    const drawPileCards = mapCards(dtoDeck?.drawPile);
    if (drawPileCards.length > 0) {
      deck.setDrawPile(drawPileCards);
    }

    // Hand
    const handCards = mapCards(dtoDeck?.hand);
    if (handCards.length > 0) {
      // addAllToHands is typed for UnitCard[], but all playable cards share the same interface here
      deck.addAllToHands(handCards as any);
    }

    // Discarded pile is currently not exposed via a setter on Deck, so we ignore it for now.

    // Create base Player with userId
    const player = new Player(String(dtoPlayer.userId), deck);

    // Restore "passed" state if needed
    if (dtoPlayer.passed) {
      player.pass();
    }

    return player;
  }
}
