import GameLeftPanel from '../ game-left-panel/GameLeftPanel';
import UserBoard from '../user-board/UserBoard';
import GameRightPanel from '../game-right-panel/GameRightPanel';
import styles from './UserGame.module.scss';
import type { Player, PlayerRows } from 'gwen-common';

type UserGameProps = {
  isCurrentPlayer: boolean;
  player: Player;
  playerRows: PlayerRows;
};

const UserGame = ({ isCurrentPlayer, player, playerRows }: UserGameProps) => {
  return (
    <div className={styles.userGame}>
      <GameLeftPanel playerRows={playerRows} isCurrentPlayer={isCurrentPlayer} player={player} />
      <UserBoard playerRows={playerRows} />
      <GameRightPanel factionId={player.getDeck().getFactionId()} deck={player.getDeck()} />
    </div>
  );
};
export default UserGame;
