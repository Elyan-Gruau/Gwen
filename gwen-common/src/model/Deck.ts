import type { UnitCard } from './cards/UnitCard';

export class Deck {
  private hand: UnitCard[];
  private discarded: UnitCard[];
  private pioche: UnitCard[];

  constructor() {
    this.hand = [];
    this.discarded = [];
    this.pioche = [];
  }

  resurrectCard(card: UnitCard) {
    const index = this.discarded.findIndex((c) => c.getId() === card.getId());
    if (index === -1) {
      throw new Error(`Card with id ${card.getId()} not found in dead hand`);
    }
    this.discarded.splice(index, 1);
    this.hand.push(card);
  }

  drawRandomCard(): UnitCard {
    if (this.pioche.length === 0) {
      throw new Error('No more cards to draw');
    }
    const randomIndex = Math.floor(Math.random() * this.pioche.length);
    const card = this.pioche.splice(randomIndex, 1)[0];
    this.hand.push(card);
    return card;
  }

  addAllToHands(cards: UnitCard[]) {
    this.hand.push(...cards);
  }

  hasEmptyHand(): boolean {
    return this.hand.length === 0;
  }

  getHand(): UnitCard[] {
    return this.hand;
  }

  getDiscarded(): UnitCard[] {
    return this.discarded;
  }

  getPioche(): UnitCard[] {
    return this.pioche;
  }
}
