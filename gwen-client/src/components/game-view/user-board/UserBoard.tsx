import { PlayerRows, Row } from 'gwen-common';
import type { RangeType } from 'gwen-common';
import BoardRowView from '../board-row-view/BoardRowView';
import styles from './UserBoard.module.scss';

export type UserBoardProps = {
  selectedCardId?: string | null;
  onRowClick?: (rowType: RangeType) => void;
  isPlacingCard?: boolean;
  playerRows: PlayerRows;
};

const UserBoard = ({
  selectedCardId,
  onRowClick,
  isPlacingCard = false,
  playerRows,
}: UserBoardProps) => {
  return (
    <div className={styles.userBoard}>
      {playerRows.getAllRows().map((row, index) => (
        <div
          key={row.getRange()}
          onClick={() => {
            if (isPlacingCard && selectedCardId && onRowClick) {
              onRowClick(row.getRange());
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
