import type { DatapackConfig } from '../../types/game/DatapackConfig';

import { MONSTERS } from './factions/MonsterFaction';
import { SCOIATAEL } from './factions/ScoiaTaelFaction';
import { NILFGAARD } from './factions/NilfgaardFaction';
import { NORTHERN_REALMS } from './factions/NorthernRealmsFaction';
import { NEUTRAL_CARDS } from './neutrals/NeutralCards';
import { NEUTRAL_SPECIALS } from './neutrals/NeutralSpecials';

export const THE_WITCHER_DATAPACK: DatapackConfig = {
  name: 'The Witcher',
  description: '',
  factions: [NORTHERN_REALMS, MONSTERS, SCOIATAEL, NILFGAARD],
  neutralUnits: NEUTRAL_CARDS,
  neutrals: NEUTRAL_SPECIALS,
};
