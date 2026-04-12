import type { UnitCardConfig } from '../../../types/game/configs/UnitCardConfig';

export const NEUTRAL_CARDS: UnitCardConfig[] = [
  {
    id: 'geralt_of_rivia',
    name: 'Geralt of Rivia',
    description:
      'The White Wolf, a legendary Witcher known for his exceptional combat skills and monster-slaying abilities.',
    imageUrl: '/neutral-units/geralt_of_rivia_1.png',
    strength: 15,
    isHero: true,
    range: 'MELEE',
  },
  {
    id: 'cirilla_fiona_elen_riannon',
    name: 'Cirilla Fiona Elen Riannon',
    description:
      "Ciri, the Lion Cub of Cintra, a powerful and agile character with a mysterious destiny intertwined with Geralt's.",
    imageUrl: '/neutral-units/cirilla_fiona_elen_rianno_1.png',
    strength: 15,
    isHero: true,
    range: 'MELEE',
  },
  {
    id: 'yennefer_of_vengerberg',
    name: 'Yennefer of Vengerberg',
    description:
      'A skilled sorceress and Geralt’s love interest, known for her intelligence, beauty, and powerful magic.',
    imageUrl: '/neutral-units/yennefer_of_vengerberg_1.png',
    strength: 7,
    isHero: true,
    ability: 'MEDIC',
    range: 'RANGED',
  },
  {
    id: 'triss_merigold',
    name: 'Triss Merigold',
    description:
      'A talented sorceress and close friend of Geralt, known for her healing abilities and involvement in political affairs.',
    imageUrl: '/neutral-units/triss_merigold_1.png',
    strength: 7,
    isHero: true,
    range: 'RANGED',
  },
  {
    id: 'villentretenmerth',
    name: 'Villentretenmerth',
    description:
      'A powerful dragon known as the Golden Dragon, who can scorch the battlefield and turn the tide of battle in favor of his allies.',
    imageUrl: '/neutral-units/villentretenmerth_1.png',
    strength: 7,
    isHero: false,
    ability: 'SCORCH',
    range: 'MELEE',
  },
  {
    id: 'vesemir',
    name: 'Vesemir',
    description:
      'The oldest and most experienced Witcher, serving as a mentor to Geralt and other young Witchers, known for his wisdom and combat prowess.',
    imageUrl: '/neutral-units/vesemir_1.png',
    strength: 6,
    isHero: false,
    range: 'MELEE',
  },
  {
    id: 'olgierd_von_everec',
    name: 'Olgierd von Everec',
    description:
      'A charismatic and enigmatic nobleman with a tragic past, known for his charm, cunning, and ability to manipulate others.',
    imageUrl: '/neutral-units/olgierd_von_everec.png',
    strength: 6,
    isHero: false,
    ability: 'MORAL_BOOST',
    range: 'AGILE',
  },
  {
    id: 'zoltan_chivay',
    name: 'Zoltan Chivay',
    description:
      'A loyal and brave dwarf, known for his combat skills, love of ale, and unwavering friendship with Geralt.',
    imageUrl: '/neutral-units/zoltan_chivay_1.png',
    strength: 5,
    range: 'MELEE',
  },
  {
    id: 'emiel_regis_rohellec_terzieff',
    name: 'Emiel Regis Rohellec Terzieff',
    description:
      'A refined and sophisticated higher vampire, known for his intelligence, wit, and ability to blend into human society.',
    imageUrl: '/neutral-units/emiel_regis_rohellec_terzieff_1.png',
    strength: 5,
    range: 'MELEE',
  },
  {
    id: 'dandelion',
    name: 'Dandelion',
    description:
      'A flamboyant and charismatic bard, known for his musical talents, storytelling abilities, and close friendship with Geralt.',
    imageUrl: '/neutral-units/dandelion_1.png',
    strength: 2,
    ability: 'COMMANDER_HORN',
    range: 'MELEE',
  },
  {
    id: 'gaunter_o_dimm',
    name: "Gaunter O'Dimm",
    description: 'A mysterious and enigmatic figure, often',
    imageUrl: '/neutral-units/gaunter_o_dimm.png',
    strength: 2,
    ability: 'MUSTER',
    range: 'MELEE',
  },
  {
    id: 'gaunter_o_dimm_darkness_1',
    name: "Gaunter O'Dimm: Darkness",
    description:
      'A mysterious and enigmatic figure, often associated with darkness and manipulation.',
    imageUrl: '/neutral-units/gaunter_o_dimm_darkness.png',
    strength: 4,
    ability: 'MUSTER',
    range: 'MELEE',
  },
  {
    id: 'gaunter_o_dimm_darkness_2',
    name: "Gaunter O'Dimm: Darkness",
    description:
      'A mysterious and enigmatic figure, often associated with darkness and manipulation.',
    imageUrl: '/neutral-units/gaunter_o_dimm_darkness.png',
    strength: 4,
    ability: 'MUSTER',
    range: 'MELEE',
  },
  {
    id: 'gaunter_o_dimm_darkness_3',
    name: "Gaunter O'Dimm: Darkness",
    description:
      'A mysterious and enigmatic figure, often associated with darkness and manipulation.',
    imageUrl: '/neutral-units/gaunter_o_dimm_darkness.png',
    strength: 4,
    ability: 'MUSTER',
    range: 'MELEE',
  },
  {
    id: 'mysterious_elf',
    name: 'Mysterious Elf',
    description:
      'An enigmatic and elusive character, shrouded in mystery and known for their unpredictable nature.',
    imageUrl: '/neutral-units/mysterious_elf_1.png',
    strength: 0,
    isHero: true,
    ability: 'SPY',
    range: 'RANGED',
  },
  {
    id: 'cow',
    name: 'Cow',
    description: 'A common farm animal, often found grazing in fields and providing milk and meat.',
    imageUrl: '/neutral-units/cow.png',
    strength: 0,
    // ability: "revenge_spawn",
    range: 'MELEE',
  },
  {
    id: 'bovine_defense_force',
    name: 'Bovine Defense Force',
    description:
      'A group of cows that have banded together to defend their territory, known for their surprising strength and resilience.',
    imageUrl: '/neutral-units/bovine_defense_force.png',
    strength: 8,
    // ability: 'revenge_spawn',
    range: 'MELEE',
  },
];
