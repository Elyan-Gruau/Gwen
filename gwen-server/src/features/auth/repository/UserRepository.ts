import mongoose, { Document, Model, Schema } from 'mongoose';
import type { DBUser } from '../model/DBUser.js';

// Define the Mongoose schema for the User model
const UserSchema = new Schema<DBUser & Document>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePictureUrl: { type: String, default: null },
  elo: { type: Number, default: 1200 },
});

// Create the Mongoose model for the User
const UserModel: Model<DBUser & Document> = mongoose.model('User', UserSchema);

export class UserRepository {
  async findById(id: string): Promise<DBUser | null> {
    return UserModel.findById(id).lean().exec();
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    return UserModel.findOne({ email }).lean().exec();
  }

  async findByUsername(username: string): Promise<DBUser | null> {
    return UserModel.findOne({ username }).lean().exec();
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ username }).exec();
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email }).exec();
    return count > 0;
  }

  async save(user: DBUser): Promise<DBUser> {
    const userDocument = new UserModel(user);
    const savedUser = await userDocument.save();
    return savedUser.toObject();
  }

  async update(user: DBUser): Promise<DBUser> {
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {
      new: true,
      returnDocument: 'after',
    })
      .lean()
      .exec();
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async findByUsernameStartingWith(
    username: string,
    options: { page: number; limit: number },
  ): Promise<{
    content: DBUser[];
    totalElements: number;
  }> {
    const query = UserModel.find({ username: new RegExp(`^${username}`, 'i') })
      .skip(options.page * options.limit)
      .limit(options.limit);

    const [content, totalElements] = await Promise.all([
      query.lean().exec(),
      UserModel.countDocuments({ username: new RegExp(`^${username}`, 'i') }).exec(),
    ]);

    return { content, totalElements };
  }

  async existsById(id: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }

  async deleteById(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }
}
