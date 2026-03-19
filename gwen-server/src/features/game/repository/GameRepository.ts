import mongoose, { Document, Model, Schema } from 'mongoose';
import type { DBGame } from '../model/DBGame.js';

// Define the Mongoose schema for the Game model
const GameSchema = new Schema<DBGame & Document>({
  player1_id: { type: String, required: true },
  player2_id: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'FINISHED', 'ABANDONED'], default: 'ACTIVE' },
  winner_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create the Mongoose model for the Game
const GameModel: Model<DBGame & Document> = mongoose.model('Game', GameSchema);

export class GameRepository {
  async save(game: DBGame): Promise<DBGame> {
    const gameDocument = new GameModel(game);
    const savedGame = await gameDocument.save();
    return savedGame.toObject();
  }

  async findById(id: string): Promise<DBGame | null> {
    return GameModel.findById(id).lean().exec();
  }

  async update(id: string, game: Partial<DBGame>): Promise<DBGame | null> {
    return GameModel.findByIdAndUpdate(id, { ...game, updated_at: new Date() }, { new: true })
      .lean()
      .exec();
  }
}

