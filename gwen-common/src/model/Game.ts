import {PlayerRows} from "./PlayerRows";

export class Game {

    private playerRows: PlayerRows[]

    constructor() {
        this.playerRows = [
            //TODO use the real userIds
            new PlayerRows("player1"),
            new PlayerRows("player2")
        ]
    }

}


