import type { DatapackConfig } from '../../types/game/DatapackConfig';

import { MONSTERS } from './factions/MonsterFaction';
import { SCOIATAEL } from './factions/ScoiaTaelFaction';
import { NILFGAARD } from './factions/NilfgaardFaction';
import { NORTHERN_REALMS } from './factions/NorthernRealmsFaction';

export const THE_WITCHER_DATAPACK: DatapackConfig = {
  name: 'The Witcher',
  description: '',
  factions: [NORTHERN_REALMS, MONSTERS, SCOIATAEL, NILFGAARD],
};
