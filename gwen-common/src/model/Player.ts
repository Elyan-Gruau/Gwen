import { Deck } from './Deck';
import { INITIAL_GEMS } from '../constants';

export class Player {
  private readonly userId: string;
  private gems: number;
  private passed: boolean;
  private deck: Deck;

  constructor(id: string) {
    this.userId = id;
    this.deck = new Deck();
    this.gems = INITIAL_GEMS;
    this.passed = false;
  }

  getUserId(): string {
    return this.userId;
  }

  hasGems(): boolean {
    return this.gems > 0;
  }

  getGems(): number {
    return this.gems;
  }

  getDeck(): Deck {
    return this.deck;
  }

  pass() {
    this.passed = true;
  }

  hasPassed(): boolean {
    return this.passed;
  }

  resetPass(): void {
    this.passed = false;
  }

  setDeck(newDeck: Deck) {
    this.deck = newDeck;
  }
}
