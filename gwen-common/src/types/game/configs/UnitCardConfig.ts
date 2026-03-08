import type { UnitsRangeType } from '../../RangeType';
import type { UnitCardAbilityType } from '../../UnitCardAbilityType';
import type { CardConfig } from './CardConfig';

export type UnitCardConfig = CardConfig & {
  strength: number;
  range: UnitsRangeType;
  isHero?: boolean;
  ability?: UnitCardAbilityType;
};
