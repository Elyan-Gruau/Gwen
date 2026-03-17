import { AuthApi } from './apis/auth.api.js';
import { UserFactionDeckApi } from './apis/user-faction-deck.api.js';

/**
 * Main API client for Gwen
 * Provides unified access to all API endpoints
 */
export class GwenApiClient {
  public readonly auth: AuthApi;
  public readonly userFactionDeck: UserFactionDeckApi;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.auth = new AuthApi(baseURL);
    this.userFactionDeck = new UserFactionDeckApi(baseURL);
  }

  /**
   * Set authorization token for all API clients
   */
  setToken(token: string): void {
    this.auth.setToken(token);
    this.userFactionDeck.setToken(token);
  }

  /**
   * Clear authorization token from all API clients
   */
  clearToken(): void {
    this.auth.clearToken();
    this.userFactionDeck.clearToken();
  }
}

export default GwenApiClient;
