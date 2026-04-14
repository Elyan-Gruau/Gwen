import { type PlayerRows } from 'gwen-common';
import BoardRowView from '../board-row-view/BoardRowView';
import styles from './UserBoard.module.scss';

export type UserBoardProps = {
  playerRows: PlayerRows;
};

const UserBoard = ({ playerRows }: UserBoardProps) => {
  const rows = playerRows.getRows();

  return (
    <div className={styles.userBoard}>
      <BoardRowView row={rows[0]} />
      <BoardRowView row={rows[1]} />
      <BoardRowView row={rows[2]} />
    </div>
  );
};

export default UserBoard;
