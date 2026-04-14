import styles from './BoardRowView.module.scss';
import type { Row } from 'gwen-common';
import ModifierSlot from './modifier-slot/ModifierSlot';
import UnitCardView from '../../card/UnitCardView';
import ScoreBadge from '../score-badge/ScoreBadge';

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
      <div>
        <ScoreBadge value={row.getScore()} />
      </div>
      <ModifierSlot modifier={row.getModifierCard()} />
      <div></div>
      <div className={styles.cardsContainer}>
        {row.getCards().map((card, index) => (
          <UnitCardView key={`${card.getName()}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
};

export default BoardRowView;
