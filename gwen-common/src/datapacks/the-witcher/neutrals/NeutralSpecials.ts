import type { NeutralConfig } from '../../../types/game/configs/NeutralConfig';

export const NEUTRAL_SPECIALS: NeutralConfig[] = [
  {
    name: 'Biting Frost',
    description: 'Sets the strength of all non-Hero Melee units to 1 for both players.',
    imageUrl: '/neutrals/biting_frost.png',
    type: 'BITING_FROST',
  },
  {
    name: 'Impenetrable Fog',
    description: 'Sets the strength of all non-Hero Ranged units to 1 for both players.',
    imageUrl: '/neutrals/impenetrable_fog.png',
    type: 'IMPENETRABLE_FOG',
  },
  {
    name: 'Torrential Rain',
    description: 'Sets the strength of all non-Hero Siege units to 1 for both players.',
    imageUrl: '/neutrals/torrential_rain.png',
    type: 'TORRENTIAL_RAIN',
  },
  {
    name: 'Clear Weather',
    description:
      'Removes all weather effects (Biting Frost, Impenetrable Fog and Torrential Rain) currently in play.',
    imageUrl: '/neutrals/clear_weather.png',
    type: 'CLEAR_WEATHER',
  },
  {
    name: 'Scorch',
    description:
      'Destroys the strongest card(s) currently on the battlefield. If multiple cards share the highest strength, all are destroyed.',
    imageUrl: '/neutrals/scorch.png',
    type: 'SCORCH',
  },
  {
    name: "Commander's Horn",
    description:
      "Doubles the strength of all non-Hero units in one row. Only one Commander's Horn may be placed on each row.",
    imageUrl: "/neutrals/commander's_horn.png",
    type: 'COMMANDER_HORN',
  },
  {
    name: 'Decoy',
    description: 'Swap with a non-Hero unit on the battlefield to return it to your hand.',
    imageUrl: '/neutrals/decoy.png',
    type: 'DECOY',
  },
];
