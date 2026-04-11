import { useMatchmaking } from '../../hooks/apis/MatckmakingAPI';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const MatchmakingPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { isSearching, queuePosition, poolSize, leaveMatchmakingPool, joinMatchmakingPool } =
    useMatchmaking(user?.id!);

  // Auto join the matchmaking pool
  if (user?.id && !isSearching) {
    joinMatchmakingPool();
  }

  const handleCancel = () => {
    // Leave the matchmaking queue and navigate back to the home page
    leaveMatchmakingPool();
    navigate(ROUTES.HOME);
  };

  return (
    <div>
      <h1>Matchmaking</h1>

      <p>Players currently in matchmaking pool: {poolSize}</p>

      {isSearching ? (
        <>
          <p>Searching for players...</p>
          <p>Your queue position: {queuePosition}</p>
          <button type="button" onClick={handleCancel}>
            Cancel matchmaking
          </button>
        </>
      ) : (
        <p>You are not currently searching for a match.</p>
      )}
    </div>
  );
};

export default MatchmakingPage;
