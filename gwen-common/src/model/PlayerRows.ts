import { Row } from './Row';

export class PlayerRows {
  private readonly userId: string;
  private score: number;
  private rows: Row[];

  constructor(userId: string) {
    this.userId = userId;
    this.score = 0;
    this.rows = [new Row('MELEE'), new Row('RANGED'), new Row('SIEGE')];
  }

  public updateScore(): number {
    let total = 0;
    this.rows.forEach((r) => (total += r.updateScore()));
    this.score = total;
    return total;
  }

  getScore() {
    return this.score;
  }

  getUserId() {
    return this.userId;
  }
}
