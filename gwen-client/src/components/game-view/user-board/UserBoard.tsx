import { Row } from 'gwen-common';
import type { RangeType } from 'gwen-common';
import BoardRowView from '../board-row-view/BoardRowView';
import styles from './UserBoard.module.scss';

export type UserBoardProps = {
  selectedCardId?: string | null;
  onRowClick?: (rowType: RangeType) => void;
  isPlacingCard?: boolean;
};

const UserBoard = ({ selectedCardId, onRowClick, isPlacingCard = false }: UserBoardProps) => {
  const dummyRows = [new Row('MELEE'), new Row('RANGED'), new Row('SIEGE')];
  const rowTypes: RangeType[] = ['MELEE', 'RANGED', 'SIEGE'];

  return (
    <div className={styles.userBoard}>
      {dummyRows.map((row, index) => (
        <div
          key={row.getRange()}
          onClick={() => {
            if (isPlacingCard && selectedCardId && onRowClick) {
              onRowClick(rowTypes[index]);
            }
          }}
          className={`${styles.rowWrapper} ${
            isPlacingCard && selectedCardId ? styles.placingMode : ''
          }`}
        >
          <BoardRowView row={row} />
        </div>
      ))}
    </div>
  );
};

export default UserBoard;
