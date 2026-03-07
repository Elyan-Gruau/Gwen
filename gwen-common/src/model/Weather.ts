import type { RangeType } from '../types/RangeType';

export class Weather {
  private rowWeather: Record<RangeType, boolean> = {
    MELEE: false,
    RANGED: false,
    SIEGE: false,
  };

  isRowAffectedByWeather(rowType: RangeType): boolean {
    return this.rowWeather[rowType];
  }

  affectRow(rowType: RangeType) {
    this.rowWeather[rowType] = true;
  }

  clearWeather() {
    this.rowWeather = {
      MELEE: false,
      RANGED: false,
      SIEGE: false,
    };
  }
}
