import GameLeftPanel from '../ game-left-panel/GameLeftPanel';
import UserBoard from '../user-board/UserBoard';
import GameRightPanel from '../game-right-panel/GameRightPanel';
import styles from './UserGame.module.scss';
import type { Player } from 'gwen-common';

type UserGameProps = {
  isCurrentPlayer: boolean;
  player: Player;
};

const UserGame = ({ isCurrentPlayer, player }: UserGameProps) => {
  return (
    <div className={styles.userGame}>
      <GameLeftPanel isCurrentPlayer={isCurrentPlayer} player={player} />
      <UserBoard />
      <GameRightPanel deck={player.getDeck()} />
    </div>
  );
};
export default UserGame;
