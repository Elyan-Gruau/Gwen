import type { DTODeck } from './DTODeck';

export interface DTOPlayer {
  userId: string;
  gems: number;
  passed: boolean;
  deck: DTODeck;
}
