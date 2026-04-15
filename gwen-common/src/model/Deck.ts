import type { UnitCard } from './cards/UnitCard';
import { type PlayableCard } from '../types/Card';
import { LeaderCard } from './cards/LeaderCard';

export class Deck {
  private hand: PlayableCard[];
  private discarded: PlayableCard[];
  private drawPile: PlayableCard[];
  private leader: LeaderCard;
  private readonly factionId: string;

  constructor(factionId: string, leader: LeaderCard) {
    this.factionId = factionId;
    this.leader = leader;
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

  findCardInHandById(cardId: string): PlayableCard {
    const maybeCard = this.hand.find((c) => c.getId() === cardId);
    if (!maybeCard) {
      throw new Error(`Card with id ${cardId} not found in hand`);
    }

    return maybeCard;
  }

  playCard(cardId: string): PlayableCard {
    // find and remove the card from the hand
    const index = this.hand.findIndex((c) => c.getId() === cardId);
    if (index === -1) {
      throw new Error(`Card with id ${cardId} not found in hand`);
    }
    const [card] = this.hand.splice(index, 1);
    return card;
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

  getLeader(): LeaderCard {
    return this.leader;
  }

  getFactionId(): string {
    return this.factionId;
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

  /**
   * Remove a card from hand (when it's played)
   */
  playCard(cardId: string): void {
    const index = this.hand.findIndex((c) => c.getId() === cardId);
    if (index === -1) {
      throw new Error(`Card with id ${cardId} not found in hand`);
    }
    this.hand.splice(index, 1);
  }
}
