/**
 * Gameplay socket event constants
 */
export const GAMEPLAY_EVENTS = {
  // Client → Server events
  PLAY_CARD: 'gameplay:play-card',

  // Server → Client events
  GAME_STATE_UPDATED: 'gameplay:game-state-updated',
  PLAY_CARD_RESPONSE: 'gameplay:play-card-response',
} as const;
