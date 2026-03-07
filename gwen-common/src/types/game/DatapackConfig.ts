import type { FactionConfig } from './FactionConfig';

export type DatapackConfig = {
  name: string;
  description: string;
  factions: FactionConfig[];
};
