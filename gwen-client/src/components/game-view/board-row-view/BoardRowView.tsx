import styles from './BoardRowView.module.scss';
import type { Row } from 'gwen-common';

export type BoardRowViewProps = {
  row: Row;
};

/**
 * Component representing a single row on the game board. It is responsible for rendering the row and its contents, such as cards and modifiers.
 * @param boardRow
 * @constructor
 */
const BoardRowView = ({ row }: BoardRowViewProps) => {
  return (
    <div className={styles.boardRow}>
      <div>{row.getModifierCard()?.getName()}</div>
      <div className={styles.cardsContainer}>
        {row.getCards().map((card) => (
          <div key={card.getId()}>{card.getName()}</div>
        ))}
      </div>
    </div>
  );
};

export default BoardRowView;
