import type { UnitsRangeType } from '../../RangeType';
import type { CharacterCardAbilityType } from '../../CharacterCardAbilityType';
import type { CardConfig } from './CardConfig';

export type CharacterCardConfig = CardConfig & {
  strength: number;
  range: UnitsRangeType;
  isHero?: boolean;
  ability?: CharacterCardAbilityType;
};
