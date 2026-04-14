import React from 'react';
import type { PlayerRows } from 'gwen-common';
import ScoreBadge from '../score-badge/ScoreBadge';

export type PlayerScoreProps = {
  playerRows: PlayerRows;
};

const PlayerScore = ({ playerRows }: PlayerScoreProps) => {
  return (
    <div>
      <ScoreBadge value={playerRows.getScore()} />
    </div>
  );
};

export default PlayerScore;
