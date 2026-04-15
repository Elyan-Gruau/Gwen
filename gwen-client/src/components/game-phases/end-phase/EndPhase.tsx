import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from 'gwen-common';
import Button from '../../reusable/button/Button';
import Gems from '../../game-view/gem/Gems';
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
  /** For game end: Current ELO before game */
  currentElo?: number;
  /** For game end: Total ELO after game (current + change) */
  totalElo?: number;
  /** For game end: opponent name */
  opponentName?: string;
  /** For round/game end: Current player's gems left */
  playerGems?: number;
  /** For round/game end: Opponent's gems left */
  opponentGems?: number;
  /** For game end: Current player's gems lost */
  playerGemsLost?: number;
  /** For game end: Opponent's gems lost */
  opponentGemsLost?: number;
};

const EndPhase = ({
  mode,
  result,
  roundEndDuration = 3000,
  onRoundEndComplete,
  eloChange = 0,
  totalElo = 0,
  opponentName = 'Opponent',
  playerGems = 0,
  opponentGems = 0,
  playerGemsLost = 0,
  opponentGemsLost = 0,
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
          <div className={styles.gemsDisplay}>
            <div className={styles.gemInfo}>
              <span>You:</span>
              <Gems activeCount={playerGems || 0} />
            </div>
            <div className={styles.gemInfo}>
              <span>Opponent:</span>
              <Gems activeCount={opponentGems || 0} />
            </div>
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
            <span className={styles.resultLabel}>Gems Status:</span>
            <div className={styles.gemsComparison}>
              <div className={styles.gemColumn}>
                <div className={styles.gemColumnLabel}>You</div>
                <Gems activeCount={2 - (playerGemsLost || 0)} />
              </div>
              <div className={styles.gemColumn}>
                <div className={styles.gemColumnLabel}>{opponentName}</div>
                <Gems activeCount={2 - (opponentGemsLost || 0)} />
              </div>
            </div>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>ELO Rating:</span>
            <div>
              <span className={styles.resultValue}>{totalElo}</span>
              <div className={`${styles.eloChange} ${getEloChangeClass()}`}>
                {Math.abs(eloChange)}
              </div>
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
