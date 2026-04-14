import { UserFactionDeckRepository } from '../repository/UserFactionDeckRepository.js';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

const DECK_RULES = {
  MAX_SPECIAL_CARDS: 10,
  MIN_UNIT_CARDS: 25,
  LEADER_CARDS: 1,
} as const;

/**
 *  Checks if a given deck is valid based on the defined rules:
 */
function isValidDeck(deck: DBUserFactionDeck): boolean {
  return (
    deck.leader_card_id !== null &&
    deck.unit_card_ids.length >= DECK_RULES.MIN_UNIT_CARDS &&
    deck.special_card_ids.length <= DECK_RULES.MAX_SPECIAL_CARDS
  );
}

export class UserFactionDeckService {
  private readonly repository: UserFactionDeckRepository;

  constructor() {
    this.repository = new UserFactionDeckRepository();
  }

  async getUserFactionDeck(userId: string, factionId: string): Promise<DBUserFactionDeck | null> {
    return this.repository.findByUserIdAndFactionId(userId, factionId);
  }

  async getOrCreateUserFactionDeck(userId: string, factionId: string): Promise<DBUserFactionDeck> {
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
      is_valid: false,
    };
    return this.repository.create(newDeck);
  }

  async getUserFactionDecks(userId: string): Promise<DBUserFactionDeck[]> {
    return this.repository.findAllByUserId(userId);
  }

  async updateUserFactionDeck(deck: DBUserFactionDeck): Promise<DBUserFactionDeck> {
    deck.is_valid = isValidDeck(deck);
    return this.repository.update(deck);
  }

  async deleteUserFactionDeck(userId: string, factionId: string): Promise<boolean> {
    return this.repository.delete(userId, factionId);
  }

  async deleteAllUserFactionDecks(userId: string): Promise<number> {
    return this.repository.deleteAllByUserId(userId);
  }

  async hasValidDeck(userId: string): Promise<boolean> {
    const decks = await this.repository.findAllByUserId(userId);
    return decks.some((deck) => isValidDeck(deck));
  }
}
