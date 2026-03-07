import { useParams } from 'react-router-dom';
import GameView from '../components/game-view/GameView';
import { Game } from 'gwen-common';

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const game = new Game(); //TODO dumy game

  return (
    <div>
      <h1>Game</h1>
      <p>Game page — /play/{gameId}</p>
      <GameView game={game} />
    </div>
  );
};

export default GamePage;
