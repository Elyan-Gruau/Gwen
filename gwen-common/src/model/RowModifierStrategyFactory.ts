import type {RowModifierStrategy} from '../ModifierStrategy.js'
import type {RowModifierStrategyType} from '../types/RowModifierCard.js'
import {StormRowModifierStrategy} from "./strategies/StormRowModifierStrategy";

export class RowModifierStrategyFactory {
    public static createStrategy(strategyType: RowModifierStrategyType): RowModifierStrategy {
        switch (strategyType) {
            case 'STORM':
                return new StormRowModifierStrategy();
            default :
                // TODO HANDLE OTHER CASES
                return new StormRowModifierStrategy();
        }
    }
}
