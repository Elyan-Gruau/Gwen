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
import { useEffect, useRef, useState } from 'react';
import { soundService } from '../../services/SoundService';

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useAuthContext();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showRoundEnd, setShowRoundEnd] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);

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

  const soundedRoundRef = useRef(false);
  const soundedGameRef = useRef(false);

  // Detect when round ends (phase transitions to REDRAW)
  useEffect(() => {
    if (game?.game.phase === 'REDRAW' && !showRoundEnd && !showGameEnd) {
      setShowRoundEnd(true);
      if (!soundedRoundRef.current) {
        soundedRoundRef.current = true;
        const myResult = game.game.lastRoundResult;
        const isWin = user && myResult?.player1_result &&
          (game.game.player1?.userId === user.id
            ? myResult.player1_result === 'WIN'
            : myResult.player2_result === 'WIN');
        isWin ? soundService.playRoundWin() : soundService.playRoundLoss();
      }
    } else if (game?.game.phase !== 'REDRAW') {
      soundedRoundRef.current = false;
    }
  }, [game?.game.phase, showRoundEnd, showGameEnd, game?.game.lastRoundResult, user]);

  // Detect when game ends (phase transitions to END)
  useEffect(() => {
    if (game?.game.phase === 'END' && !showGameEnd) {
      setShowGameEnd(true);
      if (!soundedGameRef.current) {
        soundedGameRef.current = true;
        const endResult = game.game.gameEndResult;
        const isWin = user && endResult &&
          (endResult.player1_id === user.id
            ? endResult.player1_result === 'WIN'
            : endResult.player2_result === 'WIN');
        isWin ? soundService.playGameWin() : soundService.playGameLoss();
      }
    }
  }, [game?.game.phase, showGameEnd, game?.game.gameEndResult, user]);

  useEffect(() => {
    // Auto-start round when both players are present and game is waiting or ready for next round
    if (
      game &&
      !showRoundEnd &&
      !showGameEnd &&
      ['WAITING_FOR_PLAYERS', 'REDRAW', 'FLIP_COIN'].includes(game.game.phase) &&
      game.game.player1 &&
      game.game.player2
    ) {
      startRoundMutation.mutateAsync({ gameId: gameId! }).catch((error) => {
        console.error('Failed to start round:', error);
      });
    }
  }, [game, gameId, showRoundEnd, showGameEnd, startRoundMutation]);

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
        }}
        showGameEnd={showGameEnd}
      />
    </div>
  );
};

const toModel = (gameWithMetadata: DTOGameWithMetadata): Game => {
  return GameMapper.toModel(gameWithMetadata.game);
};

export default GamePage;
