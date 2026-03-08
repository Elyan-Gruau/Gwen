import type { FactionConfig } from './FactionConfig';
import type { UnitCardConfig } from './configs/UnitCardConfig';
import type { NeutralConfig } from './configs/NeutralConfig';

export type DatapackConfig = {
  name: string;
  description: string;
  factions: FactionConfig[];
  neutralUnits: UnitCardConfig[];
  neutrals: NeutralConfig[];
};
