import { Row } from 'gwen-common';
import BoardRowView from '../board-row-view/BoardRowView';
import styles from './UserBoard.module.scss';

export type UserBoardProps = {};

type UserBoardView = {};

const UserBoard = ({}: UserBoardView) => {
  const dummyRows = [new Row('MELEE'), new Row('RANGED'), new Row('SIEGE')];

  return (
    <div className={styles.userBoard}>
      <BoardRowView row={dummyRows[0]} />
      <BoardRowView row={dummyRows[1]} />
      <BoardRowView row={dummyRows[2]} />
    </div>
  );
};

export default UserBoard;
