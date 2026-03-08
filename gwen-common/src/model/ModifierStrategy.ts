import type { Row } from './Row';
import type { UnitCard } from './cards/UnitCard';

export abstract class RowModifierStrategy {
  /**
   * Affect the row by updating the power of each card in the row according to the strategy.
   * @param row The row to be affected by the strategy.
   */
  public affectRow(row: Row) {
    row.getCards().forEach((card) => {
      const newPower = this.updateCardPower(card, row);
      card.setPower(newPower);
    });
  }

  /**
   * Update the power of a card according to the strategy. This method should be implemented by each specific strategy.
   * @param card The card whose power is to be updated.
   * @param row The row to which the card belongs, which may be needed for certain strategies that depend on the state of the row.
   */
  public abstract updateCardPower(card: UnitCard, row: Row): number;
}
