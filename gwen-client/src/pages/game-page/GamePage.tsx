import { useParams } from 'react-router-dom';
import GameView from '../../components/game-view/GameView';
import { Game } from 'gwen-common';
import { type DTOGameWithMetadata, useGetGameWithMetadataById } from 'gwen-generated-api';
import Spinner from '../../components/spinner/Spinner';
import { GameMapper } from '../../services/GameMapper';

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
      <p>gameId : {gameId}</p>
      <GameView game={toModel(game)} />
    </div>
  );
};

const toModel = (gameWithMetadata: DTOGameWithMetadata): Game => {
  return GameMapper.toModel(gameWithMetadata.game);
};

export default GamePage;
