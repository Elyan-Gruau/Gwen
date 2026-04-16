import type { PlayerRows } from 'gwen-common';
import { DTOPlayerRows } from '../dtos/DTOPlayerRows';
import { RowMapper } from './RowMapper';

export class PlayerRowMapper {
  static toDTO(playerRows: PlayerRows): DTOPlayerRows {
    return {
      userId: playerRows.getUserId(),
      score: playerRows.getScore(),
      rows: playerRows.getRows().map((row) => RowMapper.toDTO(row)),
    };
  }
}
