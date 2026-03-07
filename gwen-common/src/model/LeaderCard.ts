import { Card } from './Card';
import type { LeaderCardConfig } from '../types/game/configs/LeaderCardConfig';

export class LeaderCard extends Card {
  constructor(config: LeaderCardConfig) {
    super(config.name, config.description, config.imageUrl);
  }
}
