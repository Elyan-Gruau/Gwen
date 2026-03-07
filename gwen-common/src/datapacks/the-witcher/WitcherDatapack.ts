import type { DatapackConfig } from '../../types/game/DatapackConfig';
import { NORTHERN_REALMS } from './NorthernrealmsFaction';
import { MONSTERS } from './MonsterFaction';

export const THE_WITCHER_DATAPACK: DatapackConfig = {
  name: 'The Witcher',
  description: '',
  factions: [NORTHERN_REALMS, MONSTERS],
};
