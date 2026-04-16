import { DTOPlayer } from './DTOPlayer';
import { DTOPlayerRows } from './DTOPlayerRows';

export type DTOGameStatus = 'ACTIVE' | 'FINISHED' | 'ABANDONED';

export type DTOGameResult = 'WIN' | 'LOSS' | 'DRAW';

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

/**
 * Round end event: Shows overlay for ~3 seconds during game
 * Contains each player's result from their perspective
 */
export type DTORoundEndResult = {
  round: number;
  player1_result: DTOGameResult;
  player2_result: DTOGameResult;
  player1_score: number;
  player2_score: number;
  player1_gems: number;
  player2_gems: number;
};

/**
 * Game end result: Shows persistent page when game is over
 * Includes standings and final results
 */
export type DTOGameEndResult = {
  player1_id: string;
  player2_id: string;
  player1_result: DTOGameResult;
  player2_result: DTOGameResult;
  player1_gems_lost: number;
  player2_gems_lost: number;
  winner_id: string;
  /** TODO: Will be populated when Elo system is implemented */
  player1_elo_change?: number;
  player2_elo_change?: number;
};

export type DTOGameWithMetadata = {
  metadata: DTOGame;
  game: {
    phase: DTOGamePhase;
    currentRound: number;
    currentPlayerTurnUserId: string | null;
    player1: DTOPlayer;
    player2: DTOPlayer;
    player1Rows: DTOPlayerRows;
    player2Rows: DTOPlayerRows;
    /** Result of last completed round (null if no round completed) */
    lastRoundResult?: DTORoundEndResult | null;
    /** Final game result (null if game not ended) */
    gameEndResult?: DTOGameEndResult | null;
  };
  /** Mapping of userId to username for display purposes */
  usernames: Record<string, string>;
};

export type DTOFinishGameRequest = {
  winnerId: string;
};

// Game action requests
export type DTOPlaceCardRequest = {
  playerId: string;
  cardId: string;
  rowType: 'MELEE' | 'RANGED' | 'SIEGE';
};

export type DTOPassTurnRequest = {
  playerId: string;
};

export type DTOCoinFlipRequest = {
  gameId: string;
};

export type DTOSurrenderRequest = {
  playerId: string;
};

export type DTORematchRequest = {
  gameId: string;
};
