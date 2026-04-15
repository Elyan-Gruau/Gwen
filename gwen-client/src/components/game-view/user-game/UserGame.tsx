import GameLeftPanel from '../ game-left-panel/GameLeftPanel';
import UserBoard from '../user-board/UserBoard';
import GameRightPanel from '../game-right-panel/GameRightPanel';
import styles from './UserGame.module.scss';
import { type Player, PlayerRows, type RangeType } from 'gwen-common';

type UserGameProps = {
  isCurrentPlayer: boolean;
  player: Player;
  selectedCardId: string | null;
  playerRows: PlayerRows;
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
  playerRows,
}: UserGameProps) => {
  return (
    <div className={styles.userGame}>
      <GameLeftPanel playerRows={playerRows} isCurrentPlayer={isCurrentPlayer} player={player} />
      <UserBoard
        selectedCardId={selectedCardId}
        onRowClick={onRowClick}
        isPlacingCard={isPlacingCard && isYourTurn}
        playerRows={playerRows}
      />
      <GameRightPanel deck={player.getDeck()} factionId={player.getDeck().getFactionId()} />
    </div>
  );
};
export default UserGame;
