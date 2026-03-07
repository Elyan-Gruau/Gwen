import type { Datapack } from '../../types/game/Datapack';
import { NORTHERN_REALMS } from './NorthernrealmsFaction';
import { MONSTERS } from './MonsterFaction';

export const THE_WITCHER_DATAPACK: Datapack = {
  name: 'Witcher',
  description: '',
  factions: [NORTHERN_REALMS, MONSTERS],
};
