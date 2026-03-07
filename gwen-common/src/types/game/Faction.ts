import { type CharacterCardConfig } from '../CharacterCard';

export type Faction = {
  name: string;
  iconUrl: string;
  characters: CharacterCardConfig[];
};
