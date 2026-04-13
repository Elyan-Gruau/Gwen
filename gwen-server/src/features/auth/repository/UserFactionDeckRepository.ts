import { UserFactionDeckModel } from './UserFactionDeckModel.js';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

export class UserFactionDeckRepository {
  async findByUserIdAndFactionId(
    userId: string,
    factionId: string,
  ): Promise<DBUserFactionDeck | null> {
    return UserFactionDeckModel.findOne({ user_id: userId, faction_id: factionId }).lean().exec();
  }

  async findAllByUserId(userId: string): Promise<DBUserFactionDeck[]> {
    return UserFactionDeckModel.find({ user_id: userId }).sort({ faction_id: 1 }).lean().exec();
  }

  async create(deck: DBUserFactionDeck): Promise<DBUserFactionDeck> {
    const userDocument = new UserFactionDeckModel(deck);
    const savedDeck = await userDocument.save();
    return savedDeck.toObject();
  }

  async update(deck: DBUserFactionDeck): Promise<DBUserFactionDeck> {
    const updated = await UserFactionDeckModel.findOneAndUpdate(
      { user_id: deck.user_id, faction_id: deck.faction_id },
      {
        leader_card_id: deck.leader_card_id,
        unit_card_ids: deck.unit_card_ids,
        special_card_ids: deck.special_card_ids,
        is_valid: deck.is_valid,
        updated_at: new Date(),
      },
      { new: true },
    )
      .lean()
      .exec();
    if (!updated) {
      throw new Error('Failed to update deck');
    }
    return updated;
  }

  async delete(userId: string, factionId: string): Promise<boolean> {
    const result = await UserFactionDeckModel.deleteOne({
      user_id: userId,
      faction_id: factionId,
    }).exec();
    return result.deletedCount > 0;
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    const result = await UserFactionDeckModel.deleteMany({ user_id: userId }).exec();
    return result.deletedCount;
  }
}
