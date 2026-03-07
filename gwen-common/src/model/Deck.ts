import type { CharacterCard } from './cards/CharacterCard';

export class Deck {
  private hand: CharacterCard[];
  private discarded: CharacterCard[];
  private pioche: CharacterCard[];

  constructor() {
    this.hand = [];
    this.discarded = [];
    this.pioche = [];
  }

  resurrectCard(card: CharacterCard) {
    const index = this.discarded.findIndex((c) => c.getId() === card.getId());
    if (index === -1) {
      throw new Error(`Card with id ${card.getId()} not found in dead hand`);
    }
    this.discarded.splice(index, 1);
    this.hand.push(card);
  }

  drawRandomCard(): CharacterCard {
    if (this.pioche.length === 0) {
      throw new Error('No more cards to draw');
    }
    const randomIndex = Math.floor(Math.random() * this.pioche.length);
    const card = this.pioche.splice(randomIndex, 1)[0];
    this.hand.push(card);
    return card;
  }

  hasEmptyHand(): boolean {
    return this.hand.length === 0;
  }

  getHand(): CharacterCard[] {
    return this.hand;
  }

  getDiscarded(): CharacterCard[] {
    return this.discarded;
  }

  getPioche(): CharacterCard[] {
    return this.pioche;
  }
}
