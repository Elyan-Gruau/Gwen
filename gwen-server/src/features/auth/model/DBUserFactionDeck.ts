export interface DBUserFactionDeck {
  id?: number;
  user_id: string; // MongoDB ObjectId as string
  faction_id: string;
  leader_card_id: string | null;
  unit_card_ids: string[]; // Array of card IDs
  special_card_ids: string[]; // Array of card IDs
  created_at?: Date;
  updated_at?: Date;
}

