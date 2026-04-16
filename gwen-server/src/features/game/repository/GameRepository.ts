import mongoose, { Document, Model, Schema } from 'mongoose';
import type { DBGame } from '../model/DBGame.js';

// Define the Mongoose schema for the Game model
const GameSchema = new Schema<DBGame & Document>({
  player1_id: { type: String, required: true },
  player1_selected_deck_id: { type: String, required: true },
  player2_id: { type: String, required: true },
  player2_selected_deck_id: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'FINISHED', 'ABANDONED'], default: 'ACTIVE' },
  winner_id: { type: String, default: null },
  elo_applied: { type: Boolean, default: false },
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

  async markEloApplied(gameId: string): Promise<void> {
    await GameModel.findByIdAndUpdate(gameId, { elo_applied: true }).exec();
  }

  async hasEloBeenApplied(gameId: string): Promise<boolean> {
    const game = await GameModel.findById(gameId).lean().exec();
    return game?.elo_applied ?? false;
  }

  async findByPlayerId(
    playerId: string,
    options: { page: number; limit: number },
  ): Promise<{ content: DBGame[]; total: number }> {
    const filter = {
      $or: [{ player1_id: playerId }, { player2_id: playerId }],
      status: { $in: ['FINISHED', 'ABANDONED'] },
    };
    const [content, total] = await Promise.all([
      GameModel.find(filter)
        .sort({ created_at: -1 })
        .skip(options.page * options.limit)
        .limit(options.limit)
        .lean()
        .exec(),
      GameModel.countDocuments(filter).exec(),
    ]);
    return { content, total };
  }
}
