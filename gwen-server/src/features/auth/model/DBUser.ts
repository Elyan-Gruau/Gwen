import { ObjectId } from 'mongodb';

export interface DBUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string; // Never serialize to JSON responses
  bio: string;
  profilePictureUrl?: string | null;
}
