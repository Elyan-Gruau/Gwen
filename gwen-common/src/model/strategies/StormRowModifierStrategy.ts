import { RowModifierStrategy } from '../ModifierStrategy';
import type { UnitCard } from '../cards/UnitCard';
import type { Row } from '../Row';

export class StormRowModifierStrategy extends RowModifierStrategy {
  updateCardPower(_card: UnitCard, _row: Row): number {
    return 1;
  }
}
