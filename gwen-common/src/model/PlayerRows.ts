import {Row} from "../types/Row";

export class PlayerRows {
    private readonly userId: string;
    private score: number;
    private rows: Row[];

    constructor(userId: string) {
        this.userId = userId;
        this.score = 0;
        this.rows = [
            new Row("melee"),
            new Row("range"),
            new Row("siege")
        ]
    }

    public updateScore(): number {
        let total = 0;
        this.rows.forEach((r) => total += r.getScore());
        this.score = total;
        return total;
    }


}