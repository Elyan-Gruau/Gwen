import styles from './GameView.module.scss';
import UserGame from './user-game/UserGame';
import { Game, type Player, type PlayerRows } from 'gwen-common';
import { CategorisedPlayers } from '../../model/CategorisedPlayers';
import PlayerHand from '../player-hand/PlayerHand';
import { useAuthContext } from '../../contexts/AuthContext';
import Spinner from '../spinner/Spinner';
import Separator from './separator/Separator';
import { usePlaceCard, type DTOGameWithMetadata, usePassTurn } from 'gwen-generated-api';
import { useCallback, useState } from 'react';
import type { PlayableCard, RangeType } from 'gwen-common';
import EndPhase from '../game-phases/end-phase/EndPhase';

type GameViewProps = {
  game: Game;
  gameMetadata: DTOGameWithMetadata;
  selectedCardId: string | null;
  onSelectCard: (cardId: string | null) => void;
  gameId: string;
  refetchGame: () => void;
  showRoundEnd?: boolean;
  onRoundEndComplete?: () => void;
  showGameEnd?: boolean;
};

const GameView = ({
  game,
  gameMetadata,
  selectedCardId,
  onSelectCard,
  gameId,
  refetchGame,
  showRoundEnd = false,
  onRoundEndComplete,
  showGameEnd = false,
}: GameViewProps) => {
  const { user } = useAuthContext();
  const [isPlacingCard, setIsPlacingCard] = useState(false);

  const placeCardMutation = usePlaceCard();
  const passTurnMutation = usePassTurn();

  const currentUserId = user?.id ?? '';
  const currentPlayerTurnUserId = gameMetadata.game.currentPlayerTurnUserId;
  const isYourTurn = currentPlayerTurnUserId === currentUserId;
  const currentPlayerHasPassed = game.hasPlayerPassed(currentUserId);
  const opponentHasPassed = game.hasPlayerPassed(
    game.getPlayers().find((p) => p.getUserId() !== currentUserId)?.getUserId() ?? '',
  );

  /**
   * Handle card selection from hand
   */
  const handleCardSelect = useCallback(
    (card: PlayableCard) => {
      if (!isYourTurn || currentPlayerHasPassed) return;
      onSelectCard(card.getId());
      setIsPlacingCard(true);
    },
    [isYourTurn, currentPlayerHasPassed, onSelectCard],
  );

  /**
   * Handle row click to place the selected card
   */
  const handleRowClick = useCallback(
    async (rowType: RangeType) => {
      if (!selectedCardId || !isYourTurn || currentPlayerHasPassed) return;

      try {
        setIsPlacingCard(true);
        await placeCardMutation.mutateAsync({
          gameId,
          data: {
            playerId: currentUserId,
            cardId: selectedCardId,
            rowType,
          },
        });
        onSelectCard(null);
        setIsPlacingCard(false);
        refetchGame();
      } catch (error) {
        console.error('Failed to place card:', error);
        setIsPlacingCard(false);
      }
    },
    [
      selectedCardId,
      isYourTurn,
      currentUserId,
      gameId,
      placeCardMutation,
      onSelectCard,
      refetchGame,
    ],
  );

  /**
   * Handle pass turn
   */
  const handlePassTurn = useCallback(async () => {
    if (!isYourTurn || currentPlayerHasPassed) return;

    try {
      await passTurnMutation.mutateAsync({
        gameId,
        data: {
          playerId: currentUserId,
        },
      });
      onSelectCard(null);
      refetchGame();
    } catch (error) {
      console.error('Failed to pass turn:', error);
    }
  }, [isYourTurn, currentPlayerHasPassed, currentUserId, gameId, passTurnMutation, onSelectCard, refetchGame]);

  if (!user) {
    return <Spinner />;
  }

  const categorisedPlayers = categorisePlayer(game.getPlayers(), currentUserId);
  const currentPlayerHand = categorisedPlayers.getCurrentPlayer().getDeck().getHand();
  const opponentRows = game.getPlayerRows(categorisedPlayers.getOpponent().getUserId());
  const currentPlayerRows = game.getPlayerRows(categorisedPlayers.getCurrentPlayer().getUserId());

  // Get the current player's round result
  const currentPlayerRoundResult = game.getLastRoundResult(currentUserId);

  // Get the current player's game result
  const currentPlayerGameResult = game.getGameResult(currentUserId);
  const opponentUserId = categorisedPlayers.getOpponent().getUserId();
  const opponentName = opponentUserId || 'Opponent';
  const currentUserElo = user?.elo ?? 0;
  const eloChange = 0; // TODO: Calculate ELO change based on game result
  const totalElo = currentUserElo + eloChange;

  return (
    <div className={styles.gameView}>
      {/* Game End Page */}
      {showGameEnd && currentPlayerGameResult && (
        <EndPhase
          mode="gameEnd"
          result={currentPlayerGameResult}
          opponentName={opponentName}
          eloChange={eloChange}
          currentElo={currentUserElo}
          totalElo={totalElo}
        />
      )}

      {/* Round End Overlay */}
      {showRoundEnd && currentPlayerRoundResult && (
        <EndPhase
          mode="roundEnd"
          result={currentPlayerRoundResult}
          roundEndDuration={3000}
          onRoundEndComplete={onRoundEndComplete}
        />
      )}

      {/* Turn indicator */}
      <div className={styles.turnIndicator}>
        {currentPlayerHasPassed ? (
          <div className={styles.hasPassed}>
            <h3>✋ You Have Passed</h3>
            <p>Waiting for opponent...</p>
          </div>
        ) : isYourTurn ? (
          <div className={styles.yourTurn}>
            <h3>⭐ Your Turn</h3>
            <button
              onClick={handlePassTurn}
              disabled={passTurnMutation.isPending || isPlacingCard}
              className={styles.passButton}
            >
              {passTurnMutation.isPending ? 'Passing...' : 'Pass Turn'}
            </button>
          </div>
        ) : (
          <div className={styles.opponentTurn}>
            <h3>⏳ Opponent's Turn</h3>
            {opponentHasPassed && <p>Opponent has passed - they can keep playing</p>}
          </div>
        )}
      </div>

      <UserGame
        player={categorisedPlayers.getOpponent()}
        isCurrentPlayer={currentUserId == game.getPlayers()[0].getUserId()}
        selectedCardId={selectedCardId}
        onRowClick={handleRowClick}
        isYourTurn={isYourTurn}
        isPlacingCard={isPlacingCard}
        playerRows={opponentRows}
        isOpponentBoard={true}
        hasPlayerPassed={opponentHasPassed}
      />
      <Separator />
      <UserGame
        player={categorisedPlayers.getCurrentPlayer()}
        isCurrentPlayer={currentUserId == game.getPlayers()[1].getUserId()}
        selectedCardId={selectedCardId}
        onRowClick={handleRowClick}
        isYourTurn={isYourTurn}
        isPlacingCard={isPlacingCard}
        playerRows={currentPlayerRows}
        selectedCard={getSelectedCardFromHand(selectedCardId, currentPlayerHand)}
        isOpponentBoard={false}
        hasPlayerPassed={currentPlayerHasPassed}
      />
      <PlayerHand
        hand={currentPlayerHand}
        onCardConfirm={handleCardSelect}
        autoFocus={isYourTurn}
        gameId={gameId}
        rowType={'MELEE'}
      />
    </div>
  );
};

const categorisePlayer = (players: Player[], currentPlayerId: string): CategorisedPlayers =>
  new CategorisedPlayers(players, currentPlayerId);

const getSelectedCardFromHand = (cardId: string | null, hand: PlayableCard[]) => {
  if (!cardId) return null;
  return hand.find((card) => card.getId() === cardId) ?? null;
};

export default GameView;
