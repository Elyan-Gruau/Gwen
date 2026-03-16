import { Pool, QueryResult } from 'pg';
import { getPostgresPool } from '../../../config/database.js';
import type { DBUserFactionDeck } from '../model/DBUserFactionDeck.js';

export class UserFactionDeckRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPostgresPool();
  }

  // ...existing code...

  async findByUserIdAndFactionId(
    userId: string,
    factionId: string,
  ): Promise<DBUserFactionDeck | null> {
    const query = `
      SELECT * FROM user_faction_decks
      WHERE user_id = $1 AND faction_id = $2
    `;
    const result = await this.pool.query<DBUserFactionDeck>(query, [userId, factionId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async findAllByUserId(userId: string): Promise<DBUserFactionDeck[]> {
    const query = `
      SELECT * FROM user_faction_decks
      WHERE user_id = $1
      ORDER BY faction_id ASC
    `;
    const result = await this.pool.query<DBUserFactionDeck>(query, [userId]);
    return result.rows;
  }

  async create(deck: DBUserFactionDeck): Promise<DBUserFactionDeck> {
    const query = `
      INSERT INTO user_faction_decks (user_id, faction_id, leader_card_id, unit_card_ids, special_card_ids)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await this.pool.query<DBUserFactionDeck>(query, [
      deck.user_id,
      deck.faction_id,
      deck.leader_card_id || null,
      JSON.stringify(deck.unit_card_ids),
      JSON.stringify(deck.special_card_ids),
    ]);
    return this.parseResult(result.rows[0]);
  }

  async update(deck: DBUserFactionDeck): Promise<DBUserFactionDeck> {
    const query = `
      UPDATE user_faction_decks
      SET leader_card_id = $1, unit_card_ids = $2, special_card_ids = $3, updated_at = NOW()
      WHERE user_id = $4 AND faction_id = $5
      RETURNING *
    `;
    const result = await this.pool.query<DBUserFactionDeck>(query, [
      deck.leader_card_id || null,
      JSON.stringify(deck.unit_card_ids),
      JSON.stringify(deck.special_card_ids),
      deck.user_id,
      deck.faction_id,
    ]);
    return this.parseResult(result.rows[0]);
  }

  async delete(userId: string, factionId: string): Promise<boolean> {
    const query = `
      DELETE FROM user_faction_decks
      WHERE user_id = $1 AND faction_id = $2
    `;
    const result = await this.pool.query(query, [userId, factionId]);
    return result.rowCount! > 0;
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    const query = `
      DELETE FROM user_faction_decks
      WHERE user_id = $1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rowCount!;
  }

  private parseResult(row: any): DBUserFactionDeck {
    return {
      ...row,
      unit_card_ids: Array.isArray(row.unit_card_ids)
        ? row.unit_card_ids
        : JSON.parse(row.unit_card_ids || '[]'),
      special_card_ids: Array.isArray(row.special_card_ids)
        ? row.special_card_ids
        : JSON.parse(row.special_card_ids || '[]'),
    };
  }
}


