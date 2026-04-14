import { Faction } from './Faction';
import { type PlayableCard } from '../types/Card';
import { LeaderCard } from './cards/LeaderCard';

export class DatapackCardIndex {
  private readonly playableCardMap: Map<string, PlayableCard> = new Map();
  private readonly leaderCardMap: Map<string, LeaderCard> = new Map();

  constructor(factions: Faction[]) {
    // Index the cards
    factions.map((faction) => {
      faction.getPlayableCards().map((card) => {
        this.playableCardMap.set(card.getId(), card);
      });
      faction.getLeaders().map((leader) => {
        this.leaderCardMap.set(leader.getId(), leader);
      });
    });
  }

  findPlayableCardById(cardId: string): PlayableCard {
    const maybeCard = this.playableCardMap.get(cardId);

    if (!maybeCard) {
      throw new Error(`Playable card with id ${cardId} not found in datapack index`);
    }

    return maybeCard;
  }

  findLeaderCardById(cardId: string): LeaderCard {
    const maybeCard = this.leaderCardMap.get(cardId);

    if (!maybeCard) {
      throw new Error(`Leader card with id ${cardId} not found in datapack index`);
    }

    return maybeCard;
  }
}
