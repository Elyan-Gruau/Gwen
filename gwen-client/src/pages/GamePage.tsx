import { useParams } from 'react-router-dom';
import GameView from '../components/game-view/GameView';

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div>
      <h1>Game</h1>
      <p>Game page — /play/{gameId}</p>
      <GameView />
    </div>
  );
};

export default GamePage;
