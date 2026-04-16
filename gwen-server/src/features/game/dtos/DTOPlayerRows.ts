import { Row } from 'gwen-common';
import { DTORow } from './DTORow';

export type DTOPlayerRows = {
  userId: string;
  score: number;
  rows: DTORow[];
};
