import type { RangeType } from '../RangeType';

export type PlayCardRequest = {
  gameId: string;
  cardId: string;
  rowType: RangeType;
};

export type PlayCardResponse = {
  success: boolean;
  message?: string;
};
