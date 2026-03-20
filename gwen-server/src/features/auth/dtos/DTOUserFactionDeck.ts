export interface DTOUserFactionDeck {
  _id?: string;
  user_id: string;
  faction_id: string;
  leader_card_id: string | null;
  unit_card_ids: string[];
  special_card_ids: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DTOCreateUserFactionDeckRequest {
  factionId: string;
}

export interface DTOUpdateUserFactionDeckRequest {
  leaderCardId?: string | null;
  unitCardIds?: string[];
  specialCardIds?: string[];
}
