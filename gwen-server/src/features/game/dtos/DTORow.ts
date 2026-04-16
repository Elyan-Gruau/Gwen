import { RangeType } from 'gwen-common';
import { DTOPlayableCard } from './DTODeck';

export type DTORow = {
  readonly range: RangeType;
  readonly cardsIds: DTOPlayableCard[];
  readonly score: number;
  // modifierCardId?: string; TODO ADD LATER
};
