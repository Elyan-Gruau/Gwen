import type { LeaderCard } from './cards/LeaderCard';
import type { UnitCard } from './cards/UnitCard';
import type { NeutralCard } from './cards/NeutralCard';
import type { Faction } from './Faction';

export const USER_FACTION_DECK_RULES = {
  MAX_SPECIAL_CARDS: 10,
  MIN_UNIT_CARDS: 25,
  LEADER_CARDS: 1,
} as const;

export type AddCardResult = 'ADDED' | 'ALREADY_IN_DECK' | 'MAX_SPECIALS_REACHED' | 'NOT_IN_FACTION';
export type RemoveCardResult = 'REMOVED' | 'NOT_IN_DECK';

export class UserFactionDeck {
  private readonly faction: Faction;
  private leader: LeaderCard | null = null;
  private unitCards: UnitCard[] = [];
  private specialCards: NeutralCard[] = [];

  constructor(faction: Faction) {
    this.faction = faction;
  }

  // ─── Faction ──────────────────────────────────────────────────────────────

  getFaction(): Faction {
    return this.faction;
  }

  // ─── Leader ───────────────────────────────────────────────────────────────

  setLeader(leader: LeaderCard): void {
    const validLeader = this.faction.getLeaders().find((l) => l.getId() === leader.getId());
    if (!validLeader) return;
    this.leader = leader;
  }

  getLeader(): LeaderCard | null {
    return this.leader;
  }

  // ─── Unit Cards ───────────────────────────────────────────────────────────

  addUnitCard(card: UnitCard): AddCardResult {
    const belongsToFaction = this.faction.getUnits().some((c) => c.getId() === card.getId());
    if (!belongsToFaction) return 'NOT_IN_FACTION';
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
    const belongsToFaction = this.faction.getNeutrals().some((c) => c.getId() === card.getId());
    if (!belongsToFaction) return 'NOT_IN_FACTION';
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

  getRowDistribution(): { melee: number; ranged: number; siege: number; agile: number } {
    let melee = 0;
    let ranged = 0;
    let siege = 0;
    let agile = 0;
    for (const card of this.unitCards) {
      const ranges = card.getRanges();
      if (ranges.includes('AGILE')) {
        agile++;
      } else if (ranges.includes('MELEE')) {
        melee++;
      } else if (ranges.includes('RANGED')) {
        ranged++;
      } else if (ranges.includes('SIEGE')) {
        siege++;
      }
    }
    return { melee, ranged, siege, agile };
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
