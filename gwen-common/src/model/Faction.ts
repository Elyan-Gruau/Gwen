import type { FactionConfig } from '../types/game/FactionConfig';
import type { UnitCardConfig } from '../types';
import type { NeutralConfig } from '../types/game/configs/NeutralConfig';
import { LeaderCard } from './cards/LeaderCard';
import { UnitCard } from './cards/UnitCard';
import { NeutralCard } from './cards/NeutralCard';
import { type PlayableCard } from '../types/Card';

export class Faction {
  private readonly id: string;
  private readonly name: string;
  private readonly imageUrl: string;
  private readonly leaders: LeaderCard[];
  private readonly units: UnitCard[];
  private readonly neutrals: NeutralCard[];

  constructor(config: FactionConfig, neutralUnits: UnitCardConfig[], neutrals: NeutralConfig[]) {
    this.id = config.id;
    this.name = config.name;
    this.imageUrl = config.iconUrl;
    this.leaders = config.leaders.map((conf) => new LeaderCard(conf));
    this.units = config.units.map((conf) => new UnitCard(conf));
    this.units.push(...neutralUnits.map((conf) => new UnitCard(conf)));
    this.neutrals = neutrals.flatMap((conf) => {
      const count = conf.count ?? 1;
      return Array.from({ length: count }, (_, index) => {
        const modifiedConf: NeutralConfig = {
          ...conf,
          id: count > 1 ? `${conf.id}_${config.id}_${index}` : conf.id,
        };
        return new NeutralCard(modifiedConf);
      });
    });
  }

  getName(): string {
    return this.name;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getLeaders(): LeaderCard[] {
    return this.leaders;
  }

  getUnits(): UnitCard[] {
    return this.units;
  }

  getNeutrals(): NeutralCard[] {
    return this.neutrals;
  }

  getPlayableCards(): PlayableCard[] {
    return [...this.units, ...this.neutrals];
  }

  getId() {
    return this.id;
  }

  findCardById(cardId: string) {
    const maybeCard = this.getPlayableCards().find((card) => card.getId() === cardId);

    if (!maybeCard) {
      throw new Error(`Card with id ${cardId} not found in faction ${this.name}`);
    }

    return maybeCard;
  }
}
