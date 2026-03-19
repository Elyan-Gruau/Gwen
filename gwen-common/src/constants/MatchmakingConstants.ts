// Events CLIENT → SERVER
export const MATCHMAKING_JOIN = 'matchmaking:join'; // The user joined the queue
export const MATCHMAKING_LEAVE = 'matchmaking:leave'; // The user left the queue

// Events SERVER → CLIENT
export const MATCHMAKING_JOINED = 'matchmaking:joined'; // Joined confirmation
export const MATCHMAKING_LEFT = 'matchmaking:left'; // Left confirmation
export const MATCHMAKING_FOUND = 'matchmaking:found'; // Match found
export const MATCHMAKING_POOL_SIZE = 'matchmaking:pool:size'; // Current matchmaking pool size broadcast
