import type { UnitsRangeType } from '../../types/RangeType';
import type { CharacterCardConfig } from '../../types/game/configs/CharacterCardConfig';
import type { CharacterCardAbilityType } from '../../types/CharacterCardAbilityType';
import { Card } from './Card';

export class CharacterCard extends Card {
  private readonly baseStrength: number;
  private readonly isHero: boolean;
  private readonly ranges: UnitsRangeType[];
  private readonly ability?: CharacterCardAbilityType;
  private strength: number;

  constructor(config: CharacterCardConfig) {
    super(config.name, config.description, config.imageUrl);
    this.strength = config.strength;
    this.baseStrength = config.strength;
    this.isHero = config.isHero ?? false;
    this.ranges = Array.isArray(config.range) ? config.range : [config.range];
    this.ability = config.ability;
  }

  // ...existing code...

  getAbility(): CharacterCardAbilityType | undefined {
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
