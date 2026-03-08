import type { UnitCard } from './cards/UnitCard';
import type { RowModifierCard } from './RowModifierCard';
import type { RangeType } from '../types/RangeType';

export class Row {
  private readonly range: RangeType;
  private readonly cards: UnitCard[];
  private modifierCard: RowModifierCard | undefined;
  private score: number;

  constructor(range: RangeType) {
    this.range = range;
    this.cards = [];
    this.modifierCard = undefined;
    this.score = 0;
  }

  public setModifierCard(modifierCard: RowModifierCard) {
    this.modifierCard = modifierCard;
    this.modifierCard.affectRow(this);
  }

  public addCard(card: UnitCard) {
    this.cards.push(card);
  }

  public findCardById(id: string): UnitCard {
    const maybeCard = this.cards.find((card) => card.getId() === id);
    if (!maybeCard) {
      throw new Error(`Card with id ${id} not found in row`);
    }
    return maybeCard;
  }

  public flush() {
    this.cards.slice(0, 0);
    this.modifierCard = undefined;
  }

  updateScore(): number {
    const total = this.cards.reduce((sum, c) => sum + c.getStrength(), 0);
    this.score = total;
    return total;
  }

  getScore(): number {
    return this.score;
  }

  getCards(): UnitCard[] {
    return this.cards;
  }

  getRange() {
    return this.range;
  }

  getModifierCard(): RowModifierCard | undefined {
    return this.modifierCard;
  }
}
