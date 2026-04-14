import React from 'react';
import type { PlayerRows } from 'gwen-common';

export type PlayerScoreProps = {
  playerRows: PlayerRows;
};

const PlayerScore = ({ playerRows }: PlayerScoreProps) => {
  return <div>Score total : {playerRows.getScore()}</div>;
};

export default PlayerScore;
