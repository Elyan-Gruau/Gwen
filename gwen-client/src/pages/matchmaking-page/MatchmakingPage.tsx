import styles from './MatchmakingPage.module.scss';
import { useMatchmaking } from '../../hooks/apis/MatckmakingAPI';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useEffect } from 'react';

const MatchmakingPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isSearching,
    queuePosition,
    poolSize,
    leaveMatchmakingPool,
    joinMatchmakingPool,
    searchRange,
    searchTimeMs,
  } = useMatchmaking(user?.id ?? null);

  const deckId = (location.state as { deckId?: string })?.deckId;

  useEffect(() => {
    if (user?.id && !isSearching && deckId) {
      joinMatchmakingPool(deckId);
    }
  }, [user?.id, isSearching, deckId, joinMatchmakingPool]);

  const handleCancel = () => {
    // Leave the matchmaking queue and navigate back to the home page
    leaveMatchmakingPool();
    navigate(ROUTES.HOME);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Matchmaking</h1>

      <p className={styles.poolInfo}>
        Players in pool: <strong>{poolSize}</strong>
      </p>

      {isSearching ? (
        <div className={styles.searchContainer}>
          <h2 className={styles.searchTitle}>Searching for opponent...</h2>

          <div className={styles.searchInfo}>
            <p>
              Time searching: <strong>{formatTime(searchTimeMs)}</strong>
            </p>
            <p>
              Queue position: <strong>{queuePosition}</strong>
            </p>
          </div>

          {searchRange && (
            <div className={styles.eloRangeBox}>
              <h3>Current ELO Range</h3>
              <div className={styles.rangeValue}>
                Looking for:{' '}
                <strong>
                  {searchRange.minElo} - {searchRange.maxElo}
                </strong>
              </div>
              <div className={styles.rangeInfo}>Range: ±{searchRange.range}</div>
            </div>
          )}

          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancel matchmaking
          </button>
        </div>
      ) : (
        <p className={styles.notSearching}>You are not currently searching for a match.</p>
      )}
    </div>
  );
};

export default MatchmakingPage;
