import type { FactionConfig } from './FactionConfig';
import type { CharacterCardConfig } from './configs/CharacterCardConfig';

export type DatapackConfig = {
  name: string;
  description: string;
  factions: FactionConfig[];
  neutralUnits: CharacterCardConfig[];
};
