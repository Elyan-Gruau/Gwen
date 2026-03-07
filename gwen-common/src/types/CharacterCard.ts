import type { RangeType } from './RangeType';
import type { CharacterCardConfig } from './game/configs/CharacterCardConfig';

export class CharacterCard {
  private readonly id: string;
  private readonly name: string;
  private readonly basePower: number;
  private readonly description: string;
  private readonly isHero: boolean;
  private readonly ranges: RangeType[];
  private readonly imageUrl: string;

  private power: number;

  constructor(config: CharacterCardConfig) {
    this.id = crypto.randomUUID();
    this.name = config.name;
    this.power = config.power;
    this.basePower = config.power;
    this.description = config.description;
    /*
    A hero is not affected by modifiers or other cards.
     */
    this.isHero = config.isHero;
    this.ranges = Array.isArray(config.ranges) ? config.ranges : [config.ranges];
    this.imageUrl = config.imageUrl;
  }

  hasRange(range: RangeType): boolean {
    return this.ranges.includes(range);
  }

  getName(): string {
    return this.name;
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

  getDescription(): string {
    return this.description;
  }

  getIsHero(): boolean {
    return this.isHero;
  }

  getRanges(): RangeType[] {
    return this.ranges;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getId(): string {
    return this.id;
  }
}
