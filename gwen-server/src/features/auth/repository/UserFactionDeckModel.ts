import mongoose, { Document, Model, Schema } from 'mongoose';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

// Define the Mongoose schema for UserFactionDeck
const UserFactionDeckSchema = new Schema<DBUserFactionDeck & Document>({
  user_id: { type: String, required: true },
  faction_id: { type: String, required: true },
  leader_card_id: { type: String, default: null },
  unit_card_ids: { type: [String], default: [] },
  special_card_ids: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create unique index on user_id and faction_id (one deck per faction per user)
UserFactionDeckSchema.index({ user_id: 1, faction_id: 1 }, { unique: true });

// Create the Mongoose model for UserFactionDeck
const UserFactionDeckModel: Model<DBUserFactionDeck & Document> = mongoose.model(
  'UserFactionDeck',
  UserFactionDeckSchema,
);

export { UserFactionDeckModel };

