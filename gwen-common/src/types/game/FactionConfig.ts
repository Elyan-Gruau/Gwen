import type { UnitCardConfig } from './configs/UnitCardConfig';
import type { LeaderCardConfig } from './configs/LeaderCardConfig';

export type FactionConfig = {
  name: string;
  iconUrl: string;
  cardBackIconUrl: string;
  units: UnitCardConfig[];
  leaders: LeaderCardConfig[];
};
