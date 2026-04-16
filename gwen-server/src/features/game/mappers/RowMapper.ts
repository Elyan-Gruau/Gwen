import type { Row } from 'gwen-common';
import { DTORow } from '../dtos/DTORow';

export class RowMapper {
  static toDTO(row: Row): DTORow {
    const modifier = row.getModifierCard();
    return {
      cardsIds: row.getCards().map((card) => ({ id: card.getId() })),
      score: row.getScore(),
      range: row.getRange(),
      // modifierCard: modifier
      //   ? { name: modifier.getName(), strategy: modifier.getStrategyType() }
      //   : undefined, TODO ADD MODFIER CARD LATER
    };
  }
}
