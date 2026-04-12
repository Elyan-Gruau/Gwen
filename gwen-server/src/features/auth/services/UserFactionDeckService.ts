import { UserFactionDeckRepository } from '../repository/UserFactionDeckRepository.js';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

export class UserFactionDeckService {
  private readonly repository: UserFactionDeckRepository;

  constructor() {
    this.repository = new UserFactionDeckRepository();
  }

  async getUserFactionDeck(userId: string, factionId: string): Promise<DBUserFactionDeck | null> {
    console.info('userID', userId, ' factionId', factionId);
    return this.repository.findByUserIdAndFactionId(userId, factionId);
  }

  async getOrCreateUserFactionDeck(userId: string, factionId: string): Promise<DBUserFactionDeck> {
    console.info('userID', userId, ' factionId', factionId);
    const existingDeck = await this.repository.findByUserIdAndFactionId(userId, factionId);

    if (existingDeck) {
      return existingDeck;
    }

    // Create empty deck if it doesn't exist
    const newDeck: DBUserFactionDeck = {
      user_id: userId,
      faction_id: factionId,
      leader_card_id: null,
      unit_card_ids: [],
      special_card_ids: [],
    };
    return this.repository.create(newDeck);
  }

  async getUserFactionDecks(userId: string): Promise<DBUserFactionDeck[]> {
    return this.repository.findAllByUserId(userId);
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
