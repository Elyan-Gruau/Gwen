import styles from './GameView.module.scss';
import UserGame from './user-game/UserGame';
import { Game, type Player, type PlayerRows } from 'gwen-common';
import { CategorisedPlayers } from '../../model/CategorisedPlayers';
import PlayerHand from '../player-hand/PlayerHand';
import { useAuthContext } from '../../contexts/AuthContext';
import Spinner from '../spinner/Spinner';
import Separator from './separator/Separator';
import { usePlaceCard, usePassTurn, type DTOGameWithMetadata } from 'gwen-generated-api';
import { useCallback, useState } from 'react';
import type { PlayableCard, RangeType } from 'gwen-common';

type GameViewProps = {
  game: Game;
  gameMetadata: DTOGameWithMetadata;
  selectedCardId: string | null;
  onSelectCard: (cardId: string | null) => void;
  gameId: string;
  refetchGame: () => void;
};

const GameView = ({
  game,
  gameMetadata,
  selectedCardId,
  onSelectCard,
  gameId,
  refetchGame,
}: GameViewProps) => {
  const { user } = useAuthContext();
  const [isPlacingCard, setIsPlacingCard] = useState(false);

  const placeCardMutation = usePlaceCard();
  const passTurnMutation = usePassTurn();

  const currentUserId = user?.id ?? '';
  const currentPlayerTurnUserId = gameMetadata.game.currentPlayerTurnUserId;
  const isYourTurn = currentPlayerTurnUserId === currentUserId;

  /**
   * Handle card selection from hand
   */
  const handleCardSelect = useCallback(
    (card: PlayableCard) => {
      if (!isYourTurn) return;
      onSelectCard(card.getId());
      setIsPlacingCard(true);
    },
    [isYourTurn, onSelectCard],
  );

  /**
   * Handle row click to place the selected card
   */
  const handleRowClick = useCallback(
    async (rowType: RangeType) => {
      if (!selectedCardId || !isYourTurn) return;

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
    if (!isYourTurn) return;

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
  }, [isYourTurn, currentUserId, gameId, passTurnMutation, onSelectCard, refetchGame]);

  if (!user) {
    return <Spinner />;
  }

  const categorisedPlayers = categorisePlayer(game.getPlayers(), currentUserId);
  const currentPlayerHand = categorisedPlayers.getCurrentPlayer().getDeck().getHand();
  const opponentRows = game.getPlayerRows(categorisedPlayers.getOpponent().getUserId());
  const currentPlayerRows = game.getPlayerRows(categorisedPlayers.getCurrentPlayer().getUserId());

  return (
    <div className={styles.gameView}>
      {/* Turn indicator */}
      <div className={styles.turnIndicator}>
        {isYourTurn ? (
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

export default GameView;
