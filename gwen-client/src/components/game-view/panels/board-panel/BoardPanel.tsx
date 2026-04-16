import type { Player, PlayerRows, PlayableCard, RangeType } from 'gwen-common';
import PlayerHand from '../../../player-hand/PlayerHand';
import Separator from '../../separator/Separator';
import UserGame from '../../user-game/UserGame';
import styles from './BoardPanel.module.scss';

export type BoardPanelProps = {
  opponent: Player;
  current: Player;
  opponentRows: PlayerRows;
  currentRows: PlayerRows;
  selectedCardId: string | null;
  onRowClick: (rowType: RangeType) => void;
  isPlacingCard: boolean;
  currentPlayerTurnUserId: string | null;
  currentUserId: string;
  hasPlayerPassed: boolean;
  opponentHasPassed: boolean;
  currentPlayerHand: PlayableCard[];
  onCardConfirm: (card: PlayableCard) => void;
  getSelectedCardFromHand: (cardId: string | null, hand: PlayableCard[]) => PlayableCard | null;
};

const BoardPanel = ({
  opponent,
  current,
  opponentRows,
  currentRows,
  selectedCardId,
  onRowClick,
  isPlacingCard,
  currentPlayerTurnUserId,
  currentUserId,
  hasPlayerPassed,
  opponentHasPassed,
  currentPlayerHand,
  onCardConfirm,
  getSelectedCardFromHand,
}: BoardPanelProps) => {
  return (
    <div className={styles.boardPanelLayout}>
      <UserGame
        player={opponent}
        isCurrentPlayer={currentUserId == opponent.getUserId()}
        selectedCardId={selectedCardId}
        onRowClick={onRowClick}
        isYourTurn={currentPlayerTurnUserId === opponent.getUserId()}
        isPlacingCard={isPlacingCard}
        playerRows={opponentRows}
        isOpponentBoard={true}
        hasPlayerPassed={opponentHasPassed}
      />
      <Separator />
      <UserGame
        player={current}
        isCurrentPlayer={currentUserId == current.getUserId()}
        selectedCardId={selectedCardId}
        onRowClick={onRowClick}
        isYourTurn={currentPlayerTurnUserId === current.getUserId()}
        isPlacingCard={isPlacingCard}
        playerRows={currentRows}
        selectedCard={getSelectedCardFromHand(selectedCardId, currentPlayerHand)}
        isOpponentBoard={false}
        hasPlayerPassed={hasPlayerPassed}
      />
      <PlayerHand
        hand={currentPlayerHand}
        onCardConfirm={onCardConfirm}
        autoFocus={currentPlayerTurnUserId === currentUserId}
      />
    </div>
  );
};

export default BoardPanel;
