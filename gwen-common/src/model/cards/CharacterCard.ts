import type { RangeType } from '../../types/RangeType';
import type { CharacterCardConfig } from '../../types/game/configs/CharacterCardConfig';
import { Card } from './Card';

export class CharacterCard extends Card {
  private readonly baseStrength: number;
  /**
   A hero is not affected by modifiers or other cards.
   **/
  private readonly isHero: boolean;
  private readonly ranges: RangeType[];
  private strength: number;

  constructor(config: CharacterCardConfig) {
    super(config.name, config.description, config.imageUrl);
    this.strength = config.strength;
    this.baseStrength = config.strength;
    this.isHero = config.isHero ?? false;
    this.ranges = Array.isArray(config.range) ? config.range : [config.range];
  }

  hasRange(range: RangeType): boolean {
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

  getRanges(): RangeType[] {
    return this.ranges;
  }
}
