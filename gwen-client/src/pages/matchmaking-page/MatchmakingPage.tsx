import { useMatchmaking } from '../../hooks/apis/MatckmakingAPI';
import { useAuth } from '../../contexts/AuthContext';

const MatchmakingPage = () => {
  const { user } = useAuth();
  useMatchmaking(user?._id!);

  return (
    <div>
      <h1>Matchmaking...</h1>
      <p>Searching for players ...</p>
    </div>
  );
};

export default MatchmakingPage;
