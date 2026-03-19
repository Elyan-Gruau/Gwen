import type { UnitsRangeType } from '../../types/RangeType.js';
import type { UnitCardConfig } from '../../types/game/configs/UnitCardConfig.js';
import type { UnitCardAbilityType } from '../../types/UnitCardAbilityType.js';
import { Card } from './Card.js';

export class UnitCard extends Card {
  private readonly baseStrength: number;
  private readonly isHero: boolean;
  private readonly ranges: UnitsRangeType[];
  private readonly ability?: UnitCardAbilityType;
  private strength: number;

  constructor(config: UnitCardConfig) {
    super(config.name, config.description, config.imageUrl);
    this.strength = config.strength;
    this.baseStrength = config.strength;
    this.isHero = config.isHero ?? false;
    this.ranges = Array.isArray(config.range) ? config.range : [config.range];
    this.ability = config.ability;
  }

  // ...existing code...

  getAbility(): UnitCardAbilityType | undefined {
    return this.ability;
  }

  hasRange(range: UnitsRangeType): boolean {
    return this.ranges.includes(range);
  }

  getBaseStrength() {
    return this.baseStrength;
  }

  getStrength(): number {
    if (this.isHero) {
      return this.baseStrength;
    }
    return this.strength;
  }

  setPower(newStrength: number) {
    this.strength = newStrength;
  }

  getIsHero(): boolean {
    return this.isHero;
  }

  getRanges(): UnitsRangeType[] {
    return this.ranges;
  }
}
