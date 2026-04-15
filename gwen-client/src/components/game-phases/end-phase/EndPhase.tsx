import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from 'gwen-common';
import Button from '../../reusable/button/Button';
import { ROUTES } from '../../../constants/routes';
import styles from './EndPhase.module.scss';

export type EndPhaseProps = {
  /** Is this the end of a round or the end of the game? */
  mode: 'roundEnd' | 'gameEnd';
  /** Result of the round/game */
  result: GameResult;
  /** For round end: auto-close after this many ms (default 3000) */
  roundEndDuration?: number;
  /** Callback when round end auto-closes */
  onRoundEndComplete?: () => void;
  /** For game end: ELO change (can be negative) */
  eloChange?: number;
  /** For game end: opponent name */
  opponentName?: string;
};

const EndPhase = ({
  mode,
  result,
  roundEndDuration = 3000,
  onRoundEndComplete,
  eloChange = 0,
  opponentName = 'Opponent',
}: EndPhaseProps) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  // Auto-close round end overlay
  useEffect(() => {
    if (mode === 'roundEnd') {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onRoundEndComplete?.();
        }, 300); // Animation duration
      }, roundEndDuration);

      return () => clearTimeout(timer);
    }
  }, [mode, roundEndDuration, onRoundEndComplete]);

  const getResultText = () => {
    switch (result) {
      case GameResult.WIN:
        return 'You Win!';
      case GameResult.LOSS:
        return 'You Lose!';
      case GameResult.DRAW:
        return 'Draw!';
    }
  };

  const getEloChangeClass = () => {
    if (eloChange > 0) return styles.positive;
    if (eloChange < 0) return styles.negative;
    return styles.neutral;
  };

  // Round End - Temporary Overlay
  if (mode === 'roundEnd') {
    return (
      <div
        className={styles.roundEndOverlay}
        style={{
          opacity: isClosing ? 0 : 1,
          transition: 'opacity 300ms ease',
        }}
      >
        <div className={styles.roundEndContent}>
          <div className={`${styles.gameEndTitle} ${styles[result.toLowerCase()]}`}>
            {getResultText()}
          </div>
        </div>
      </div>
    );
  }

  // Game End - Persistent Page
  return (
    <div className={styles.gameEndContainer}>
      <div className={styles.gameEndCard}>
        <h1 className={`${styles.gameEndTitle} ${styles[result.toLowerCase()]}`}>
          {getResultText()}
        </h1>

        <div className={styles.resultDetails}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Opponent:</span>
            <span className={styles.resultValue}>{opponentName}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>ELO Rating:</span>
            <div>
              <span className={styles.resultValue}>+0 ELO</span>
              <div className={`${styles.eloChange} ${getEloChangeClass()}`}>{eloChange}</div>
            </div>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Status:</span>
            <span className={styles.resultValue}>
              {result === GameResult.WIN
                ? '🏆 Victory'
                : result === GameResult.LOSS
                  ? '💔 Defeat'
                  : '⚖️ Tied'}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
            Main Menu
          </Button>
          <Button size="lg" variant="primary" onClick={() => navigate(ROUTES.PLAY)}>
            Rematch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndPhase;
