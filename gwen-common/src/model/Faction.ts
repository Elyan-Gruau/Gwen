import type { FactionConfig } from '../types/game/FactionConfig';
import type { UnitCardConfig } from '../types';
import type { NeutralConfig } from '../types/game/configs/NeutralConfig';
import { LeaderCard } from './cards/LeaderCard';
import { UnitCard } from './cards/UnitCard';
import { NeutralCard } from './cards/NeutralCard';

export class Faction {
  private readonly name: string;
  private readonly imageUrl: string;
  private readonly leaders: LeaderCard[];
  private readonly units: UnitCard[];
  private readonly neutrals: NeutralCard[];

  constructor(config: FactionConfig, neutralUnits: UnitCardConfig[], neutrals: NeutralConfig[]) {
    this.name = config.name;
    this.imageUrl = config.iconUrl;
    this.leaders = config.leaders.map((conf) => new LeaderCard(conf));
    this.units = config.units.map((conf) => new UnitCard(conf));
    this.units.push(...neutralUnits.map((conf) => new UnitCard(conf)));
    this.neutrals = neutrals.flatMap((conf) =>
      Array.from({ length: conf.count ?? 1 }, () => new NeutralCard(conf)),
    );
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

  getPlayableCards(): (UnitCard | NeutralCard)[] {
    return [...this.units, ...this.neutrals];
  }
}
