import type { RangeType } from '../../RangeType';
import type { CharacterCardAbilityType } from '../../CharacterCardAbilityType';
import type { CardConfig } from './CardConfig';

export type CharacterCardConfig = CardConfig & {
  power: number;
  isHero: boolean;
  ranges: RangeType | RangeType[];
  ability?: CharacterCardAbilityType;
};
