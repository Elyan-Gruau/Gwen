export type DTOGameStatus = 'ACTIVE' | 'FINISHED' | 'ABANDONED';

export type DTOGame = {
  _id: string;
  player1_id: string;
  player2_id: string;
  status: DTOGameStatus;
  winner_id: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DTOFinishGameRequest = {
  winnerId: string;
};

