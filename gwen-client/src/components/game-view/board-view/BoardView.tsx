import BoardRowView from '../board-row-view/BoardRowView';
import styles from './BoardView.module.scss';
import { Row } from 'gwen-common';

const Board = () => {
  return (
    <div className={styles.boardView}>
      <UserBoard invertDisplay={false} />
      <UserBoard invertDisplay={true} />
    </div>
  );
};

type UserBoardView = {
  invertDisplay: boolean;
};

const UserBoard = ({}: UserBoardView) => {
  const dummyRows = [new Row('MELEE'), new Row('RANGE'), new Row('SIEGE')];

  return (
    <div>
      <BoardRowView row={dummyRows[0]} />
      <BoardRowView row={dummyRows[1]} />
      <BoardRowView row={dummyRows[2]} />
    </div>
  );
};

export default Board;
