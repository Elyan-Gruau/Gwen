import { CharacterCard } from './CharacterCard';

export type Faction = {
  name: string;
  iconUrl: string;
  characters: CharacterCard[];
};
