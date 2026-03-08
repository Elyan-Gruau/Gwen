import type { CardConfig } from './CardConfig';

export type NeutralType =
  | 'BITING_FROST'
  | 'TORRENTIAL_RAIN'
  | 'IMPENETRABLE_FOG'
  | 'CLEAR_WEATHER'
  | 'SCORCH'
  | 'COMMANDER_HORN'
  | 'DECOY';

export type NeutralConfig = CardConfig & {
  type: NeutralType;
  /** Number of copies of this card in the deck. Defaults to 1. */
  count?: number;
};
