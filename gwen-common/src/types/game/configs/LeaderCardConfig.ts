import type { CardConfig } from './CardConfig';
import type { LeaderAbilityType } from '../../LeaderAbilityType';

export type LeaderCardConfig = CardConfig & {
  ability: LeaderAbilityType;
};
