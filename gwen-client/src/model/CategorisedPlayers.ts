import type { Player } from 'gwen-common';

export class CategorisedPlayers {
  private currentPlayer: Player;
  private adversaries: Player[];

  constructor(players: Player[], currentPlayerId: String) {
    this.adversaries = [];
    let tempCurrentPlayer: Player | undefined;

    players.forEach((p) => {
      if (p.getUserId() != currentPlayerId) {
        this.adversaries.push(p);
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

  getAdversaries() {
    return this.adversaries;
  }

  getAdversary() {
    if (this.adversaries.length === 0) {
      throw new Error('No adversaries found.');
    }
    if (this.adversaries.length > 1) {
      throw new Error('Multiple adversaries found.');
    }
    return this.adversaries[0];
  }
}
