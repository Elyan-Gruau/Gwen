import { ObjectId } from 'mongodb';

export interface DBGame {
  _id?: ObjectId;
  player1_id: string;
  player1_selected_deck_id: string;
  player2_id: string;
  player2_selected_deck_id: string;
  status: 'ACTIVE' | 'FINISHED' | 'ABANDONED';
  winner_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
