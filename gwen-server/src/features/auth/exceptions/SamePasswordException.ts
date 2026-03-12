import type { UUID } from 'node:crypto';

export class SamePasswordException extends Error {
  constructor(id: UUID) {
    super('New password cannot be the same as the old password for user with ID: ' + id);
    this.name = 'SamePasswordException';
  }
}
