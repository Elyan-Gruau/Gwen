import bcrypt from 'bcrypt';

/**
 * Service for hashing and verifying passwords using BCrypt.
 * BCrypt automatically generates a unique random salt for each password hash.
 */
export class PasswordHasher {
  private static readonly STRENGTH_FACTOR = 12;

  /**
   * Hashes a password using BCrypt with automatic salt generation.
   * @param password - the plain text password
   * @returns the hashed password with embedded salt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordHasher.STRENGTH_FACTOR);
  }

  /**
   * Verifies a plain text password against a hashed password.
   * @param plainPassword - the plain text password to verify
   * @param hashedPassword - the hashed password to compare against
   * @returns true if the password matches, false otherwise
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
