import type { CharacterCardConfig } from './configs/CharacterCardConfig';
import type { LeaderCardConfig } from './configs/LeaderCardConfig';

export type FactionConfig = {
  name: string;
  iconUrl: string;
  characters: CharacterCardConfig[];
  leaders: LeaderCardConfig[];
};
