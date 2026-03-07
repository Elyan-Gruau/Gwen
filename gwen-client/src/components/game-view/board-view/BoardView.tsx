import styles from './BoardView.module.scss';
import UserBoard from '../user-board/UserBoard';

const Board = () => {
  return (
    <div className={styles.boardView}>
      <UserBoard invertDisplay={false} />
      <UserBoard invertDisplay={true} />
    </div>
  );
};

export default Board;
