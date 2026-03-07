import type { CharacterCard } from './types/CharacterCard';

export class Deck {
  private hand: CharacterCard[];
  private deadHand: CharacterCard[];
  private pioche: CharacterCard[];

  constructor() {
    this.hand = [];
    this.deadHand = [];
    this.pioche = [];
  }

  resurrectCard(card: CharacterCard) {
    const index = this.deadHand.findIndex((c) => c.getId() === card.getId());
    if (index === -1) {
      throw new Error(`Card with id ${card.getId()} not found in dead hand`);
    }
    this.deadHand.splice(index, 1);
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

  getDeadCards(): CharacterCard[] {
    return this.deadHand;
  }

  getPioche(): CharacterCard[] {
    return this.pioche;
  }
}
