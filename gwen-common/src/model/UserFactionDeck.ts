import type { LeaderCard } from './cards/LeaderCard';
import type { UnitCard } from './cards/UnitCard';
import type { NeutralCard } from './cards/NeutralCard';

export const USER_FACTION_DECK_RULES = {
  MAX_SPECIAL_CARDS: 10,
  MIN_UNIT_CARDS: 25,
  LEADER_CARDS: 1,
} as const;

export type AddCardResult = 'ADDED' | 'ALREADY_IN_DECK' | 'MAX_SPECIALS_REACHED';
export type RemoveCardResult = 'REMOVED' | 'NOT_IN_DECK';

export class UserFactionDeck {
  private leader: LeaderCard | null = null;
  private unitCards: UnitCard[] = [];
  private specialCards: NeutralCard[] = [];

  // ─── Leader ───────────────────────────────────────────────────────────────

  setLeader(leader: LeaderCard): void {
    this.leader = leader;
  }

  getLeader(): LeaderCard | null {
    return this.leader;
  }

  // ─── Unit Cards ───────────────────────────────────────────────────────────

  addUnitCard(card: UnitCard): AddCardResult {
    if (this.unitCards.some((c) => c.getId() === card.getId())) {
      return 'ALREADY_IN_DECK';
    }
    this.unitCards.push(card);
    return 'ADDED';
  }

  removeUnitCard(cardId: string): RemoveCardResult {
    const index = this.unitCards.findIndex((c) => c.getId() === cardId);
    if (index === -1) return 'NOT_IN_DECK';
    this.unitCards.splice(index, 1);
    return 'REMOVED';
  }

  getUnitCards(): UnitCard[] {
    return [...this.unitCards];
  }

  // ─── Special / Neutral Cards ──────────────────────────────────────────────

  addSpecialCard(card: NeutralCard): AddCardResult {
    if (this.specialCards.some((c) => c.getId() === card.getId())) {
      return 'ALREADY_IN_DECK';
    }
    if (this.specialCards.length >= USER_FACTION_DECK_RULES.MAX_SPECIAL_CARDS) {
      return 'MAX_SPECIALS_REACHED';
    }
    this.specialCards.push(card);
    return 'ADDED';
  }

  removeSpecialCard(cardId: string): RemoveCardResult {
    const index = this.specialCards.findIndex((c) => c.getId() === cardId);
    if (index === -1) return 'NOT_IN_DECK';
    this.specialCards.splice(index, 1);
    return 'REMOVED';
  }

  getSpecialCards(): NeutralCard[] {
    return [...this.specialCards];
  }

  // ─── Getters (stats) ──────────────────────────────────────────────────────

  getHeroCards(): UnitCard[] {
    return this.unitCards.filter((c) => c.getIsHero());
  }

  getTotalUnitCardStrength(): number {
    return this.unitCards.reduce((sum, c) => sum + c.getBaseStrength(), 0);
  }

  getNumberOfUnits(): number {
    return this.unitCards.length;
  }

  getTotalCards(): number {
    const leaderCount = this.leader ? 1 : 0;
    return leaderCount + this.unitCards.length + this.specialCards.length;
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  isValid(): boolean {
    return (
      this.leader !== null &&
      this.unitCards.length >= USER_FACTION_DECK_RULES.MIN_UNIT_CARDS &&
      this.specialCards.length <= USER_FACTION_DECK_RULES.MAX_SPECIAL_CARDS
    );
  }

  hasCard(cardId: string): boolean {
    return (
      this.unitCards.some((c) => c.getId() === cardId) ||
      this.specialCards.some((c) => c.getId() === cardId) ||
      this.leader?.getId() === cardId
    );
  }
}
