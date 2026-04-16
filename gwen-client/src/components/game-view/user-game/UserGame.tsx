import GameLeftPanel from '../ game-left-panel/GameLeftPanel';
import UserBoard from '../user-board/UserBoard';
import GameRightPanel from '../game-right-panel/GameRightPanel';
import styles from './UserGame.module.scss';
import { type Player, PlayerRows, type RangeType, type PlayableCard } from 'gwen-common';

type UserGameProps = {
  isCurrentPlayer: boolean;
  player: Player;
  selectedCardId: string | null;
  playerRows: PlayerRows;
  onRowClick?: (rowType: RangeType) => void;
  isYourTurn?: boolean;
  isPlacingCard?: boolean;
  selectedCard?: PlayableCard | null;
  isOpponentBoard?: boolean;
  hasPlayerPassed?: boolean;
};

const UserGame = ({
  isCurrentPlayer: _isCurrentPlayer,
  player,
  selectedCardId,
  onRowClick,
  isYourTurn = false,
  isPlacingCard = false,
  playerRows,
  selectedCard = null,
  isOpponentBoard = false,
  hasPlayerPassed = false,
}: UserGameProps) => {
  return (
    <div className={styles.userGame}>
      <GameLeftPanel
        playerRows={playerRows}
        player={player}
        isOpponent={isOpponentBoard}
        isActiveTurn={isYourTurn}
        hasPlayerPassed={hasPlayerPassed}
      />
      <UserBoard
        selectedCardId={selectedCardId}
        onRowClick={onRowClick}
        isPlacingCard={isPlacingCard && isYourTurn}
        playerRows={playerRows}
        selectedCard={selectedCard}
        isOpponentBoard={isOpponentBoard}
      />
      <GameRightPanel deck={player.getDeck()} factionId={player.getDeck().getFactionId()} />
    </div>
  );
};
export default UserGame;
