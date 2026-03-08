import type { NeutralConfig, NeutralType } from '../../types/game/configs/NeutralConfig';
import { Card } from './Card';

export class NeutralCard extends Card {
  private readonly type: NeutralType;

  constructor(config: NeutralConfig) {
    super(config.name, config.description, config.imageUrl);
    this.type = config.type;
  }

  getType(): NeutralType {
    return this.type;
  }
}
