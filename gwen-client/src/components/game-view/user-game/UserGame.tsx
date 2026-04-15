import GameLeftPanel from '../ game-left-panel/GameLeftPanel';
import UserBoard from '../user-board/UserBoard';
import GameRightPanel from '../game-right-panel/GameRightPanel';
import styles from './UserGame.module.scss';
import type { Player, RangeType } from 'gwen-common';

type UserGameProps = {
  isCurrentPlayer: boolean;
  player: Player;
  selectedCardId: string | null;
  onRowClick?: (rowType: RangeType) => void;
  isYourTurn?: boolean;
  isPlacingCard?: boolean;
};

const UserGame = ({
  isCurrentPlayer,
  player,
  selectedCardId,
  onRowClick,
  isYourTurn = false,
  isPlacingCard = false,
}: UserGameProps) => {
  return (
    <div className={styles.userGame}>
      <GameLeftPanel isCurrentPlayer={isCurrentPlayer} player={player} />
      <UserBoard
        selectedCardId={selectedCardId}
        onRowClick={onRowClick}
        isPlacingCard={isPlacingCard && isYourTurn}
      />
      <GameRightPanel deck={player.getDeck()} />
    </div>
  );
};
export default UserGame;
