import { Player, PlayerRows } from 'gwen-common';

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

export type DTOGamePhase = 'WAITING_FOR_PLAYERS' | 'REDRAW' | 'FLIP_COIN' | 'PLAY_CARDS' | 'END';

export type DTOGameWithMetadata = {
  metadata: DTOGame;
  game: {
    phase: DTOGamePhase;
    player1: Player;
    player2: Player;
    player1Rows: PlayerRows;
    player2Rows: PlayerRows;
  };
};

export type DTOFinishGameRequest = {
  winnerId: string;
};
