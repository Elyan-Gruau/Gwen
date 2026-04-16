import { useEffect, useState } from 'react';
import styles from './TurnTimer.module.scss';

const TURN_DURATION_SECONDS = 30;

type TurnTimerProps = {
  turnStartedAt: string | null;
  label: string;
};

const TurnTimer = ({ turnStartedAt, label }: TurnTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(TURN_DURATION_SECONDS);

  useEffect(() => {
    if (!turnStartedAt) return;

    const update = () => {
      const elapsed = (Date.now() - new Date(turnStartedAt).getTime()) / 1000;
      setSecondsLeft(Math.max(0, Math.ceil(TURN_DURATION_SECONDS - elapsed)));
    };

    update();
    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [turnStartedAt]);

  const isUrgent = secondsLeft <= 10;

  return (
    <div className={`${styles.timerBlock} ${isUrgent ? styles.urgent : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{secondsLeft}s</span>
    </div>
  );
};

export default TurnTimer;
