import React from 'react';
import styles from './ScoreBadge.module.scss';

export type ScoreBadgeProps = {
  value: number;
  isOpponent?: boolean;
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ value, isOpponent = false }) => {
  const badgeClass = isOpponent
    ? `${styles.scoreBadge} ${styles.opponentBadge}`
    : `${styles.scoreBadge} ${styles.playerBadge}`;
  return <div className={badgeClass}>{value}</div>;
};

export default ScoreBadge;
