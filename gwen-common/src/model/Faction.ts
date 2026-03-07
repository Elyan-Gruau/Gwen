import type { FactionConfig } from '../types/game/FactionConfig';
import { LeaderCard } from './cards/LeaderCard';
import { CharacterCard } from './cards/CharacterCard';

export class Faction {
  private readonly name: string;
  private readonly imageUrl: string;
  private readonly leaders: LeaderCard[];
  private readonly characters: CharacterCard[];

  constructor(config: FactionConfig) {
    this.name = config.name;
    this.imageUrl = config.iconUrl;
    this.leaders = config.leaders.map((conf) => new LeaderCard(conf));
    this.characters = config.characters.map((conf) => new CharacterCard(conf));
  }

  getName(): string {
    return this.name;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getLeaders(): LeaderCard[] {
    return this.leaders;
  }

  getCharacters(): CharacterCard[] {
    return this.characters;
  }
}
