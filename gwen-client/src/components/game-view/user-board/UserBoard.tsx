import { PlayerRows, Row } from 'gwen-common';
import type { RangeType } from 'gwen-common';
import BoardRowView from '../board-row-view/BoardRowView';
import styles from './UserBoard.module.scss';
import { useState, useRef } from 'react';

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
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const rows = playerRows.getAllRows();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    // Handle row navigation with arrow keys
    if (key === 'ArrowUp') {
      setActiveRowIndex((prev) => {
        if (prev === null) return 0;
        return Math.max(prev - 1, 0);
      });
      event.preventDefault();
      return;
    }

    if (key === 'ArrowDown') {
      setActiveRowIndex((prev) => {
        if (prev === null) return 0;
        return Math.min(prev + 1, rows.length - 1);
      });
      event.preventDefault();
      return;
    }

    // Handle card placement on Enter
    if (key === 'Enter' && isPlacingCard && selectedCardId && activeRowIndex !== null) {
      const selectedRow = rows[activeRowIndex];
      if (selectedRow && onRowClick) {
        onRowClick(selectedRow.getRange());
        setActiveRowIndex(null);
      }
      event.preventDefault();
    }
  };

  return (
    <div
      ref={boardRef}
      className={styles.userBoard}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {rows.map((row, index) => (
        <div
          key={row.getRange()}
          onClick={() => {
            if (isPlacingCard && selectedCardId && onRowClick) {
              onRowClick(row.getRange());
              setActiveRowIndex(null);
            }
          }}
          className={`${styles.rowWrapper} ${
            isPlacingCard && selectedCardId ? styles.placingMode : ''
          } ${activeRowIndex === index ? styles.selectedRow : ''}`}
        >
          <BoardRowView row={row} />
        </div>
      ))}
    </div>
  );
};

export default UserBoard;
