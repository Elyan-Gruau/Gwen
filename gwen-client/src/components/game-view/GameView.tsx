import styles from './GameView.module.scss';
import UserGame from './user-game/UserGame';

const GameView = () => {
  return (
    <div className={styles.gameView}>
      <UserGame isCurrentPlayer={false} />
      <span>SEPARATOR</span>
      <UserGame isCurrentPlayer={true} />
    </div>
  );
};

export default GameView;
