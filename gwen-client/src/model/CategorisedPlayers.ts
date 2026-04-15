import type { Player } from 'gwen-common';

export class CategorisedPlayers {
  private currentPlayer: Player;
  private opponents: Player[];

  constructor(players: Player[], currentPlayerId: string) {
    this.opponents = [];
    let tempCurrentPlayer: Player | undefined;

    players.forEach((p) => {
      if (p.getUserId() != currentPlayerId) {
        this.opponents.push(p);
      } else {
        tempCurrentPlayer = p;
      }
    });

    if (!tempCurrentPlayer) {
      throw new Error('Current player not found.');
    }
    this.currentPlayer = tempCurrentPlayer;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  getOpponents() {
    return this.opponents;
  }

  getOpponent() {
    if (this.opponents.length === 0) {
      throw new Error('No opponents found.');
    }
    if (this.opponents.length > 1) {
      throw new Error('Multiple opponents found.');
    }
    return this.opponents[0];
  }
}
