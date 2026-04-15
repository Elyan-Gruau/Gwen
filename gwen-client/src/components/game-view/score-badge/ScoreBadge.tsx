import React from 'react';
import styles from './ScoreBadge.module.scss';

export type BadgeSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type ScoreBadgeProps = {
  value: number;
  isOpponent?: boolean;
  size?: BadgeSize;
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ value, isOpponent = false, size = 'MEDIUM' }) => {
  const badgeClass = isOpponent
    ? `${styles.scoreBadge} ${styles.opponentBadge} ${styles[`size-${size.toLowerCase()}`]}`
    : `${styles.scoreBadge} ${styles.playerBadge} ${styles[`size-${size.toLowerCase()}`]}`;
  return <div className={badgeClass}>{value}</div>;
};

export default ScoreBadge;
