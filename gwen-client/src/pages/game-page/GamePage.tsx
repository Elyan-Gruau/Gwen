import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameView from '../../components/game-view/GameView';
import { Game } from 'gwen-common';
import styles from './GamePage.module.scss';
import { type DTOGameWithMetadata, useGetGameWithMetadataById } from 'gwen-generated-api';
import Spinner from '../../components/spinner/Spinner';
import { GameMapper } from '../../services/GameMapper';
import { getGameBackgroundPictureUrl } from '../../utils/URLProvider';
import { useGameplaySocket } from '../../hooks/useGameplaySocket';

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { data, isLoading, isError } = useGetGameWithMetadataById(gameId!);
  const [gameModel, setGameModel] = useState<Game | null>(null);

  useEffect(() => {
    if (data) {
      setGameModel(GameMapper.toModel(data.game));
    }
  }, [data]);

  const handleGameStateUpdate = useCallback((payload: any) => {
    const updated = payload?.game;
    if (!updated) return;
    try {
      setGameModel(GameMapper.toModel(updated));
    } catch (error) {
      console.error('Game mapping error via WebSocket', error, payload);
    }
  }, []);

  useGameplaySocket({ gameId: gameId!, onGameStateUpdate: handleGameStateUpdate });

  if (isLoading) return <Spinner />;
  if (isError || !data) return <div>Aucune partie trouvée avec l'id {gameId}</div>;
  if (!gameModel) return <Spinner />;

  return (
    <div
      className={styles.gamePage}
      style={{ backgroundImage: `url(${getGameBackgroundPictureUrl()})` }}
    >
      <p>gameId : {gameId}</p>
      <GameView game={gameModel} gameId={gameId!} />
    </div>
  );
};

export default GamePage;
