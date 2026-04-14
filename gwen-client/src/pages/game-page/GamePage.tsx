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

  const { data: game, isLoading } = useGetGameWithMetadataById(gameId!);

  const [gameModel, setGameModel] = useState<Game | null>(null);

  useEffect(() => {
    if (game) {
      console.log('[GamePage] HTTP DTOGameWithMetadata reçu :', game);
      console.log('[GamePage] HTTP game (payload brut) :', game.game);
      setGameModel(toModel(game));
    }
  }, [game]);

  const handleGameStateUpdate = useCallback((payload: any) => {
    const updated = payload?.game;
    if (!updated) return;

    // Log de l'objet game reçu via WebSocket
    console.log('[GamePage] WS GAME_STATE_UPDATED payload complet :', payload);
    console.log('[GamePage] WS game (payload brut) :', updated);

    try {
      const next = GameMapper.toModel(updated as any);
      setGameModel(next);
    } catch (error) {
      console.error('Failed to map game state update', error, payload);
    }
  }, []);

  useGameplaySocket({ gameId: gameId!, onGameStateUpdate: handleGameStateUpdate });

  if (isLoading || !gameModel) {
    return <Spinner />;
  }

  if (!game) {
    return <div>No game found with id {gameId}</div>;
  }

  const style = {
    backgroundImage: `url(${getGameBackgroundPictureUrl()})`,
  };

  return (
    <div className={styles.gamePage} style={style}>
      <p>gameId : {gameId}</p>
      <GameView game={gameModel} gameId={gameId!} />
    </div>
  );
};

const toModel = (gameWithMetadata: DTOGameWithMetadata): Game => {
  return GameMapper.toModel(gameWithMetadata.game);
};

export default GamePage;
