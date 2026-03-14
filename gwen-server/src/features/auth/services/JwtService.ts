import jwt from 'jsonwebtoken';
import type { DBUser } from '../model/DBUser.js';

interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}

/**
 * Service for generating and validating JWT tokens.
 */
export class JwtService {
  constructor(
    private readonly secret: string,
    private readonly expiration: number, // in milliseconds
  ) {}

  /**
   * Generate a JWT token for a user
   * @param user - the user to generate the token for
   * @returns the JWT token
   */
  generateToken(user: DBUser): string {
    const payload: JwtPayload = {
      userId: user._id!.toString(),
      username: user.username,
      email: user.email,
    };

    return jwt.sign(payload, this.secret, {
      subject: user.username,
      expiresIn: this.expiration,
    });
  }

  /**
   * Extract username from token
   * @param token - the JWT token
   * @returns the username
   */
  extractUsername(token: string): string {
    const decoded = this.extractAllClaims(token);
    return decoded.sub as string;
  }

  /**
   * Extract user ID from token
   * @param token - the JWT token
   * @returns the user ID as string
   */
  extractUserId(token: string): string {
    const claims = this.extractAllClaims(token);
    return claims['userId'] as string;
  }

  /**
   * Extract expiration date from token
   * @param token - the JWT token
   * @returns the expiration date
   */
  extractExpiration(token: string): Date {
    const claims = this.extractAllClaims(token);
    return new Date((claims.exp as number) * 1000);
  }

  /**
   * Extract a specific claim from token
   * @param token - the JWT token
   * @param claimKey - the key of the claim to extract
   * @returns the claim value
   */
  extractClaim<T>(token: string, claimKey: string): T {
    const claims = this.extractAllClaims(token);
    return claims[claimKey] as T;
  }

  /**
   * Extract all claims from token
   * @param token - the JWT token
   * @returns all claims as decoded payload
   */
  private extractAllClaims(token: string): jwt.JwtPayload {
    const decoded = jwt.verify(token, this.secret);
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }
    return decoded;
  }

  /**
   * Check if token is expired
   * @param token - the JWT token
   * @returns true if expired, false otherwise
   */
  isTokenExpired(token: string): boolean {
    return this.extractExpiration(token) < new Date();
  }

  /**
   * Validate token
   * @param token - the JWT token
   * @param username - the username to validate against
   * @returns true if valid, false otherwise
   */
  validateToken(token: string, username: string): boolean {
    try {
      const extractedUsername = this.extractUsername(token);
      return extractedUsername === username && !this.isTokenExpired(token);
    } catch {
      return false;
    }
  }
}
