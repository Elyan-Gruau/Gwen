import type { Deck } from 'gwen-common/dist/model/Deck';
import type { DTODeck, DTOPlayableCard } from '../dtos/DTODeck';

export abstract class DeckMapper {
  static toDTO(deck: Deck): DTODeck {
    const serialize = (cards: any[]): DTOPlayableCard[] => cards.map((c) => ({ id: c.getId() }));
    return {
      drawPile: serialize(deck.getDrawPile()),
      hand: serialize(deck.getHand()),
      discardPile: serialize(deck.getDiscarded()),
      leader: { id: deck.getLeader().getId() },
      factionId: deck.getFactionId(),
    };
  }
}
