import type { UnitCard } from './cards/UnitCard';
import { type PlayableCard } from '../types/Card';

export class Deck {
  private hand: PlayableCard[];
  private discarded: PlayableCard[];
  private drawPile: PlayableCard[];

  constructor() {
    this.hand = [];
    this.discarded = [];
    this.drawPile = [];
  }

  resurrectCard(card: PlayableCard) {
    //TODO only non hero unit can resurect
    const index = this.discarded.findIndex((c) => c.getId() === card.getId());
    if (index === -1) {
      throw new Error(`Card with id ${card.getId()} not found in dead hand`);
    }
    this.discarded.splice(index, 1);
    this.hand.push(card);
  }

  drawRandomCard(): PlayableCard {
    if (this.drawPile.length === 0) {
      throw new Error('No more cards to draw');
    }
    const randomIndex = Math.floor(Math.random() * this.drawPile.length);
    const card = this.drawPile.splice(randomIndex, 1)[0];
    this.hand.push(card);
    return card;
  }

  addAllToHands(cards: UnitCard[]) {
    this.hand.push(...cards);
  }

  hasEmptyHand(): boolean {
    return this.hand.length === 0;
  }

  getHand(): PlayableCard[] {
    return this.hand;
  }

  getDiscarded(): PlayableCard[] {
    return this.discarded;
  }

  getDrawPile(): PlayableCard[] {
    return this.drawPile;
  }

  setDrawPile(newDrawPile: PlayableCard[]) {
    this.drawPile = [...newDrawPile];
  }

  /**
   * Draws multiple cards from the drawPile & puts them in the hand.
   * @param amount the amount of card to draw
   */
  drawCards(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.drawCard();
    }
  }

  /**
   * Draws a card from the drawPile & puts it in the hand.
   */
  drawCard(): void {
    const maybeCard = this.drawPile.pop();

    if (!maybeCard) {
      console.error('Unable to draw card, the drawPile is empty');
      return;
    }

    this.hand.push(maybeCard);
  }
}
