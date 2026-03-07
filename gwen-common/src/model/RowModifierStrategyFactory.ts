import type { RowModifierStrategy } from './ModifierStrategy';
import type { RowModifierStrategyType } from './RowModifierCard';
import { StormRowModifierStrategy } from './strategies/StormRowModifierStrategy';

export class RowModifierStrategyFactory {
  public static createStrategy(strategyType: RowModifierStrategyType): RowModifierStrategy {
    switch (strategyType) {
      case 'STORM':
        return new StormRowModifierStrategy();
      default:
        // TODO HANDLE OTHER CASES
        return new StormRowModifierStrategy();
    }
  }
}
