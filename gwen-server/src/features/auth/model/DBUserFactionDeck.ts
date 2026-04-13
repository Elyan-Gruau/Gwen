import { ObjectId } from 'mongodb';

export interface DBUserFactionDeck {
  _id?: ObjectId;
  user_id: string;
  faction_id: string;
  leader_card_id: string | null;
  unit_card_ids: string[];
  special_card_ids: string[];
  is_valid: boolean;
  created_at?: Date;
  updated_at?: Date;
}
