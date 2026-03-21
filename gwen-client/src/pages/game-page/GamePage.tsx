import { useParams } from 'react-router-dom';
import GameView from '../../components/game-view/GameView';
import { Game, Player } from 'gwen-common';
import { useGetGameWithMetadataById } from 'gwen-generated-api';
import Spinner from '../../components/spinner/Spinner';
import type { DTOGameWithMetadata } from 'gwen-server/dist/features/game/dtos/DTOGame';

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const { data: game, isLoading } = useGetGameWithMetadataById(gameId!);

  if (isLoading) {
    return <Spinner />;
  }

  if (!game) {
    return <div>No game found with id {gameId}</div>;
  }

  return (
    <div>
      <h1>Game</h1>
      <p>Game page — /play/{gameId}</p>
      <GameView game={toModel(game)} />
    </div>
  );
};

const toModel = (gameWithMetadata: DTOGameWithMetadata): Game => {
  const player1 = new Player(gameWithMetadata.metadata.player1_id);
  const player2 = new Player(gameWithMetadata.metadata.player2_id);
  const game = new Game(player1, player2);
  //todo rebuild the entire game object
  return game;
};

export default GamePage;
