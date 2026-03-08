import type { FactionConfig } from './FactionConfig';
import type { UnitCardConfig } from './configs/UnitCardConfig';

export type DatapackConfig = {
  name: string;
  description: string;
  factions: FactionConfig[];
  neutralUnits: UnitCardConfig[];
};
