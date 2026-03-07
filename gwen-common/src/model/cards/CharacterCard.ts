import type { RangeType } from '../../types/RangeType';
import type { CharacterCardConfig } from '../../types/game/configs/CharacterCardConfig';
import { Card } from './Card';

export class CharacterCard extends Card {
  private readonly basePower: number;
  /**
   A hero is not affected by modifiers or other cards.
   **/
  private readonly isHero: boolean;
  private readonly ranges: RangeType[];
  private power: number;

  constructor(config: CharacterCardConfig) {
    super(config.name, config.description, config.imageUrl);
    this.power = config.power;
    this.basePower = config.power;
    this.isHero = config.isHero;
    this.ranges = Array.isArray(config.ranges) ? config.ranges : [config.ranges];
  }

  hasRange(range: RangeType): boolean {
    return this.ranges.includes(range);
  }

  getBasePower() {
    return this.basePower;
  }

  getPower(): number {
    if (this.isHero) {
      return this.basePower;
    }
    return this.power;
  }

  setPower(newPower: number) {
    this.power = newPower;
  }

  getIsHero(): boolean {
    return this.isHero;
  }

  getRanges(): RangeType[] {
    return this.ranges;
  }
}
