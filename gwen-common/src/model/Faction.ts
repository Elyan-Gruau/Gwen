import type { FactionConfig } from '../types/game/FactionConfig';
import { LeaderCard } from './cards/LeaderCard';
import { UnitCard } from './cards/UnitCard';
import type { UnitCardConfig } from '../types';

export class Faction {
  private readonly name: string;
  private readonly imageUrl: string;
  private readonly leaders: LeaderCard[];
  private readonly units: UnitCard[];

  constructor(config: FactionConfig, neutralUnits: UnitCardConfig[]) {
    this.name = config.name;
    this.imageUrl = config.iconUrl;
    this.leaders = config.leaders.map((conf) => new LeaderCard(conf));
    this.units = config.units.map((conf) => new UnitCard(conf));
    // Add neutral units to the faction's units
    this.units.push(...neutralUnits.map((conf) => new UnitCard(conf)));
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
}
