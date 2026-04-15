import { PlayerRows, Row } from 'gwen-common';
import type { RangeType, PlayableCard } from 'gwen-common';
import BoardRowView from '../board-row-view/BoardRowView';
import styles from './UserBoard.module.scss';
import { useState, useRef } from 'react';

export type UserBoardProps = {
  selectedCardId?: string | null;
  onRowClick?: (rowType: RangeType) => void;
  isPlacingCard?: boolean;
  playerRows: PlayerRows;
  selectedCard?: PlayableCard | null;
  isOpponentBoard?: boolean;
};

const UserBoard = ({
  selectedCardId,
  onRowClick,
  isPlacingCard = false,
  playerRows,
  selectedCard = null,
  isOpponentBoard = false,
}: UserBoardProps) => {
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const rows = playerRows.getAllRows();

  /**
   * Check if a row is valid for the selected card
   * - Regular cards can be placed on their designated row type
   * - AGILE cards can be placed on MELEE or RANGED rows (but not SIEGE)
   */
  const isRowValid = (rowRange: RangeType): boolean => {
    if (!selectedCard) return true; // If no card, all rows are valid
    
    const card = selectedCard as any;
    
    // Check if card has exact row type (MELEE, RANGED, or SIEGE)
    if (card.hasRange?.(rowRange)) {
      return true;
    }
    
    // Check if card is AGILE and row is MELEE or RANGED (AGILE cannot go on SIEGE)
    if (card.hasRange?.('AGILE') && (rowRange === 'MELEE' || rowRange === 'RANGED')) {
      return true;
    }
    
    return false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Disable keyboard navigation on opponent board
    if (isOpponentBoard) return;

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

    // Handle card placement on Enter (only if row is valid and not opponent board)
    if (
      key === 'Enter' &&
      !isOpponentBoard &&
      isPlacingCard &&
      selectedCardId &&
      activeRowIndex !== null
    ) {
      const selectedRow = rows[activeRowIndex];
      const rowRange = selectedRow.getRange();
      if (selectedRow && onRowClick && isRowValid(rowRange)) {
        onRowClick(rowRange);
        setActiveRowIndex(null);
      }
      event.preventDefault();
    }
  };

  return (
    <div ref={boardRef} className={styles.userBoard} onKeyDown={handleKeyDown} tabIndex={0}>
      {rows.map((row, index) => {
        const rowRange = row.getRange();
        const isValid = isRowValid(rowRange);
        return (
          <div
            key={rowRange}
            onClick={() => {
              if (!isOpponentBoard && isPlacingCard && selectedCardId && onRowClick && isValid) {
                onRowClick(rowRange);
                setActiveRowIndex(null);
              }
            }}
            className={`${
              styles.rowWrapper
            } ${!isOpponentBoard && isPlacingCard && selectedCardId ? styles.placingMode : ''} ${
              !isOpponentBoard && activeRowIndex === index ? styles.selectedRow : ''
            } ${!isOpponentBoard && isPlacingCard && selectedCardId && !isValid ? styles.invalidRow : ''}`}
          >
            <BoardRowView row={row} />
          </div>
        );
      })}
    </div>
  );
};

export default UserBoard;
