import { JwtService } from '../../features/auth/services/JwtService';
import type { DBUser } from '../../features/auth/model/DBUser';

describe('JwtService', () => {
  let jwtService: JwtService;
  const secret = 'test-secret-key';
  const expirationMs = 3600000; // 1 hour

  const mockUser: DBUser = {
    _id: { toString: () => 'user-123' } as any,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    bio: 'Test bio',
    elo: 1200,
  };

  beforeEach(() => {
    jwtService = new JwtService(secret, expirationMs);
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = jwtService.generateToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT structure: header.payload.signature
    });
  });

  describe('extractUsername', () => {
    it('should extract username from valid token', () => {
      const token = jwtService.generateToken(mockUser);
      const username = jwtService.extractUsername(token);

      expect(username).toBe('testuser');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.extractUsername(invalidToken)).toThrow();
    });
  });

  describe('extractUserId', () => {
    it('should extract user ID from valid token', () => {
      const token = jwtService.generateToken(mockUser);
      const userId = jwtService.extractUserId(token);

      expect(userId).toBe('user-123');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.extractUserId(invalidToken)).toThrow();
    });
  });

  describe('extractExpiration', () => {
    it('should extract expiration date from valid token', () => {
      const token = jwtService.generateToken(mockUser);
      const expiration = jwtService.extractExpiration(token);

      expect(expiration).toBeInstanceOf(Date);
      expect(expiration.getTime()).toBeGreaterThan(Date.now());
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.extractExpiration(invalidToken)).toThrow();
    });
  });

  describe('extractClaim', () => {
    it('should extract specific claim from token', () => {
      const token = jwtService.generateToken(mockUser);
      const email = jwtService.extractClaim<string>(token, 'email');

      expect(email).toBe('test@example.com');
    });

    it('should extract username claim', () => {
      const token = jwtService.generateToken(mockUser);
      const username = jwtService.extractClaim<string>(token, 'username');

      expect(username).toBe('testuser');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.extractClaim(invalidToken, 'email')).toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for a fresh token', () => {
      const token = jwtService.generateToken(mockUser);
      const isExpired = jwtService.isTokenExpired(token);

      expect(isExpired).toBe(false);
    });


    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.isTokenExpired(invalidToken)).toThrow();
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token with matching username', () => {
      const token = jwtService.generateToken(mockUser);
      const isValid = jwtService.validateToken(token, 'testuser');

      expect(isValid).toBe(true);
    });

    it('should return false for token with non-matching username', () => {
      const token = jwtService.generateToken(mockUser);
      const isValid = jwtService.validateToken(token, 'differentuser');

      expect(isValid).toBe(false);
    });

    it('should return false for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const isValid = jwtService.validateToken(invalidToken, 'testuser');

      expect(isValid).toBe(false);
    });

    it('should return false for token with different secret', () => {
      const token = jwtService.generateToken(mockUser);
      const differentService = new JwtService('different-secret', expirationMs);
      const isValid = differentService.validateToken(token, 'testuser');

      expect(isValid).toBe(false);
    });
  });

  describe('full token lifecycle', () => {
    it('should handle complete token generation and validation flow', () => {
      // Generate token
      const token = jwtService.generateToken(mockUser);
      expect(token).toBeDefined();

      // Validate token
      const isValid = jwtService.validateToken(token, 'testuser');
      expect(isValid).toBe(true);

      // Extract claims
      const username = jwtService.extractUsername(token);
      expect(username).toBe('testuser');

      const userId = jwtService.extractUserId(token);
      expect(userId).toBe('user-123');

      const email = jwtService.extractClaim<string>(token, 'email');
      expect(email).toBe('test@example.com');

      // Check expiration
      const isExpired = jwtService.isTokenExpired(token);
      expect(isExpired).toBe(false);
    });
  });
});




