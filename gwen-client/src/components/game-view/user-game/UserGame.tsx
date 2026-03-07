import GameLeftPanel from '../ game-left-panel/GameLeftPanel';
import UserBoard from '../user-board/UserBoard';
import GameRightPanel from '../game-right-panel/GameRightPanel';
import styles from './UserGame.module.scss';

type UserGameProps = {
  isCurrentPlayer: boolean;
};

const UserGame = ({ isCurrentPlayer }: UserGameProps) => {
  return (
    <div className={styles.userGame}>
      <GameLeftPanel isCurrentPlayer={isCurrentPlayer} />
      <UserBoard />
      <GameRightPanel />
    </div>
  );
};
export default UserGame;
