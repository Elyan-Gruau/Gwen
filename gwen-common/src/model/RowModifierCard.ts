import type { RowModifierStrategy } from './ModifierStrategy';
import type { Row } from './Row';
import { RowModifierStrategyFactory } from './RowModifierStrategyFactory';

export class RowModifierCard {
  private readonly name: string;
  private readonly stategy: RowModifierStrategy;

  constructor(config: RowModifierCardConfig) {
    this.name = config.name;
    this.stategy = RowModifierStrategyFactory.createStrategy(config.strategy);
  }

  public affectRow(row: Row) {
    this.stategy.affectRow(row);
  }

  public getName(): string {
    return this.name;
  }
}

export type RowModifierCardConfig = {
  name: string;
  strategy: RowModifierStrategyType;
};

export type RowModifierStrategyType = 'STORM' | 'FOG' | 'RAIN' | 'DOUBLE';
