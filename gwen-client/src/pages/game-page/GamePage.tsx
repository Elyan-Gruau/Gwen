import { useParams } from 'react-router-dom';
import GameView from '../../components/game-view/GameView';
import { Game } from 'gwen-common';
import styles from './GamePage.module.scss';
import {
  type DTOGameWithMetadata,
  useGetGameWithMetadataById,
  useStartRound,
} from 'gwen-generated-api';
import Spinner from '../../components/spinner/Spinner';
import { GameMapper } from '../../services/GameMapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useAuthContext();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showRoundEnd, setShowRoundEnd] = useState(false);
  const [roundEndPhase, setRoundEndPhase] = useState<string | null>(null);

  // Poll game state every 1 second
  const {
    data: game,
    isLoading,
    refetch,
  } = useGetGameWithMetadataById(gameId!, {
    query: {
      refetchInterval: 1000,
    },
  });

  const startRoundMutation = useStartRound();

  // Detect when round ends (phase transitions to REDRAW)
  useEffect(() => {
    if (game?.game.phase === 'REDRAW' && !showRoundEnd) {
      setShowRoundEnd(true);
      setRoundEndPhase('REDRAW');
    }
  }, [game?.game.phase, showRoundEnd]);

  useEffect(() => {
    // Auto-start round when both players are present and game is waiting or ready for next round
    if (
      game &&
      !showRoundEnd &&
      ['WAITING_FOR_PLAYERS', 'REDRAW', 'FLIP_COIN'].includes(game.game.phase) &&
      game.game.player1 &&
      game.game.player2
    ) {
      startRoundMutation.mutateAsync({ gameId: gameId! }).catch((error) => {
        console.error('Failed to start round:', error);
      });
    }
  }, [game?.game.phase, gameId, showRoundEnd]);

  useEffect(() => {
    // Clear selected card when it's not your turn
    if (game && user && game.game.currentPlayerTurnUserId !== user.id) {
      setSelectedCardId(null);
    }
  }, [game, user]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!game) {
    return <div>No game found with id {gameId}</div>;
  }

  const style = {
    // TODO replace the url with an URL provider
    backgroundImage: 'url(/data-packs/the-witcher/board/background.png)',
  };

  return (
    <div className={styles.gamePage} style={style}>
      <p>gameId : {gameId}</p>
      <GameView
        game={toModel(game)}
        gameMetadata={game}
        selectedCardId={selectedCardId}
        onSelectCard={setSelectedCardId}
        gameId={gameId!}
        refetchGame={refetch}
        showRoundEnd={showRoundEnd}
        onRoundEndComplete={() => {
          setShowRoundEnd(false);
          setRoundEndPhase(null);
        }}
      />
    </div>
  );
};

const toModel = (gameWithMetadata: DTOGameWithMetadata): Game => {
  return GameMapper.toModel(gameWithMetadata.game);
};

export default GamePage;
