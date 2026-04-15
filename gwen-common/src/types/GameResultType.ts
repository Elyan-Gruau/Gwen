export const GameResult = {
  WIN: 'WIN',
  LOSS: 'LOSS',
  DRAW: 'DRAW',
} as const;

export type GameResult = typeof GameResult[keyof typeof GameResult];
