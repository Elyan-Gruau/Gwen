/**
 * Matchmaking socket event constants
 */
export const MATCHMAKING_EVENTS = {
  // Client → Server events
  JOIN: 'matchmaking:join',
  LEAVE: 'matchmaking:leave',

  // Server → Client events
  JOINED: 'matchmaking:joined',
  LEFT: 'matchmaking:left',
  FOUND: 'matchmaking:found',
} as const;

