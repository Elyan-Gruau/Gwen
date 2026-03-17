import { UserFactionDeckRepository } from '../repository/UserFactionDeckRepository.js';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

export class UserFactionDeckService {
  private readonly repository: UserFactionDeckRepository;

  constructor() {
    this.repository = new UserFactionDeckRepository();
  }

  async getUserFactionDeck(userId: string, factionId: string): Promise<DBUserFactionDeck | null> {
    return this.repository.findByUserIdAndFactionId(userId, factionId);
  }

  async getUserFactionDecks(userId: string): Promise<DBUserFactionDeck[]> {
    return this.repository.findAllByUserId(userId);
  }

  async createUserFactionDeck(userId: string, factionId: string): Promise<DBUserFactionDeck> {
    const deck: DBUserFactionDeck = {
      user_id: userId,
      faction_id: factionId,
      leader_card_id: null,
      unit_card_ids: [],
      special_card_ids: [],
    };
    return this.repository.create(deck);
  }

  async updateUserFactionDeck(deck: DBUserFactionDeck): Promise<DBUserFactionDeck> {
    return this.repository.update(deck);
  }

  async deleteUserFactionDeck(userId: string, factionId: string): Promise<boolean> {
    return this.repository.delete(userId, factionId);
  }

  async deleteAllUserFactionDecks(userId: string): Promise<number> {
    return this.repository.deleteAllByUserId(userId);
  }
}
