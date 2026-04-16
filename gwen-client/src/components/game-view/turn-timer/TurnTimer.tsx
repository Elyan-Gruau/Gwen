import { useEffect, useRef, useState } from 'react';
import styles from './TurnTimer.module.scss';
import { soundService } from '../../../services/SoundService';

const TURN_DURATION_SECONDS = 30;

type TurnTimerProps = {
  turnStartedAt: string | null;
  label: string;
  playTickSound?: boolean;
};

const TurnTimer = ({ turnStartedAt, label, playTickSound = false }: TurnTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(TURN_DURATION_SECONDS);
  const lastTickRef = useRef<number>(-1);

  useEffect(() => {
    if (!turnStartedAt) return;

    const update = () => {
      const elapsed = (Date.now() - new Date(turnStartedAt).getTime()) / 1000;
      const sLeft = Math.max(0, Math.ceil(TURN_DURATION_SECONDS - elapsed));
      setSecondsLeft(sLeft);

      if (playTickSound && sLeft <= 5 && sLeft > 0 && sLeft !== lastTickRef.current) {
        lastTickRef.current = sLeft;
        soundService.playTimerTick();
      }
    };

    update();
    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [turnStartedAt, playTickSound]);

  const isUrgent = secondsLeft <= 10;

  return (
    <div className={`${styles.timerBlock} ${isUrgent ? styles.urgent : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{secondsLeft}s</span>
    </div>
  );
};

export default TurnTimer;
