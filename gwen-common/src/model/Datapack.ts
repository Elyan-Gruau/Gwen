import type { DatapackConfig } from '../types/game/DatapackConfig';
import { Faction } from './Faction';
import { validateAllCardIds } from '../utils/CardIdValidator';

export class Datapack {
  private readonly name: string;
  private readonly description: string;
  private readonly factions: Faction[];

  constructor(config: DatapackConfig) {
    validateAllCardIds(config);

    this.name = config.name;
    this.description = config.description;
    this.factions = config.factions.map(
      (unitConf) => new Faction(unitConf, config.neutralUnits, config.neutrals),
    );
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getFactions(): Faction[] {
    return this.factions;
  }
}
