import { PasswordHasher } from '../../features/auth/services/PasswordHasher';

describe('PasswordHasher', () => {
  let passwordHasher: PasswordHasher;

  beforeEach(() => {
    passwordHasher = new PasswordHasher();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const plainPassword = 'mySecurePassword123!';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword); // Should not be the same
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const plainPassword = 'mySecurePassword123!';
      const hash1 = await passwordHasher.hashPassword(plainPassword);
      const hash2 = await passwordHasher.hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2); // Different salts produce different hashes
    });

    it('should hash empty password', async () => {
      const plainPassword = '';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should hash long password', async () => {
      const plainPassword = 'x'.repeat(200);
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const plainPassword = 'mySecurePassword123!';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword(plainPassword, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const plainPassword = 'mySecurePassword123!';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword('wrongPassword', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should reject empty password when hash is not for empty', async () => {
      const plainPassword = 'mySecurePassword123!';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword('', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should verify empty password', async () => {
      const plainPassword = '';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword(plainPassword, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should be case sensitive', async () => {
      const plainPassword = 'MySecurePassword123!';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword('mysecurepassword123!', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should handle special characters', async () => {
      const plainPassword = 'P@$$w0rd!#%&*()[]{}';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword(plainPassword, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should verify password with unicode characters', async () => {
      const plainPassword = 'contraseña™café©';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);
      const isValid = await passwordHasher.verifyPassword(plainPassword, hashedPassword);

      expect(isValid).toBe(true);
    });
  });

  describe('password security', () => {
    it('should produce bcrypt format hash', async () => {
      const plainPassword = 'testPassword';
      const hashedPassword = await passwordHasher.hashPassword(plainPassword);

      // Bcrypt format: $2a$12$... or $2b$12$...
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('should not verify with wrong hash', async () => {
      const plainPassword = 'myPassword';
      const hashedPassword1 = await passwordHasher.hashPassword(plainPassword);
      const hashedPassword2 = await passwordHasher.hashPassword('anotherPassword');

      const isValid = await passwordHasher.verifyPassword(plainPassword, hashedPassword2);
      expect(isValid).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete password flow for registration', async () => {
      // Registration: hash password
      const registrationPassword = 'newUserPassword123';
      const hashedPassword = await passwordHasher.hashPassword(registrationPassword);
      expect(hashedPassword).toBeDefined();

      // Login: verify password
      const loginPassword = 'newUserPassword123';
      const isValid = await passwordHasher.verifyPassword(loginPassword, hashedPassword);
      expect(isValid).toBe(true);

      // Login: wrong password
      const wrongPassword = 'wrongPassword';
      const isInvalid = await passwordHasher.verifyPassword(wrongPassword, hashedPassword);
      expect(isInvalid).toBe(false);
    });

    it('should handle multiple user scenarios', async () => {
      const users = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
        { username: 'user3', password: 'pass3' },
      ];

      const hashedPasswords = await Promise.all(
        users.map((u) => passwordHasher.hashPassword(u.password)),
      );

      // Verify correct passwords
      for (let i = 0; i < users.length; i++) {
        const isValid = await passwordHasher.verifyPassword(users[i].password, hashedPasswords[i]);
        expect(isValid).toBe(true);
      }

      // Verify passwords don't match wrong hashes
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users.length; j++) {
          if (i !== j) {
            const isValid = await passwordHasher.verifyPassword(
              users[i].password,
              hashedPasswords[j],
            );
            expect(isValid).toBe(false);
          }
        }
      }
    });
  });
});
