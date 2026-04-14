import { Row } from './Row';
import type { RangeType } from '../types/RangeType';

export class PlayerRows {
  private readonly userId: string;
  private score: number;
  private rows: Row[];

  constructor(userId: string) {
    this.userId = userId;
    this.score = 0;
    this.rows = [new Row('MELEE'), new Row('RANGED'), new Row('SIEGE')];
  }

  private updateScore(): number {
    let total = 0;
    this.rows.forEach((r) => (total += r.updateScore()));
    this.score = total;
    return total;
  }

  public getScore() {
    this.updateScore();
    return this.score;
  }

  getUserId() {
    return this.userId;
  }

  getRows(): Row[] {
    return this.rows;
  }

  getRow(range: RangeType): Row {
    const maybeRow = this.rows.find((row) => row.getRange() === range);
    if (!maybeRow) {
      throw new Error(`Row with range ${range} not found for player ${this.userId}`);
    }
    return maybeRow;
  }
}
