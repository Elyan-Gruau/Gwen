import { RowModifierStrategy } from '../ModifierStrategy';
import type { CharacterCard } from '../cards/CharacterCard';
import type { Row } from '../Row';

export class StormRowModifierStrategy extends RowModifierStrategy {
  updateCardPower(_card: CharacterCard, _row: Row): number {
    return 1;
  }
}
