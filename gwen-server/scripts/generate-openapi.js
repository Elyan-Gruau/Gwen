#!/usr/bin/env node

/**
 * API Generation Script
 * Generates TypeScript source files for gwen-generated-api from the OpenAPI spec
 * Run: npm run build --workspace=gwen-server && npm run generate-api
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Generating API client source files...\n');

// Import the compiled swagger config
let specs;
try {
  const { specs: loadedSpecs } = await import('../dist/config/swagger.js');
  specs = loadedSpecs;
  console.log('✅ OpenAPI spec loaded\n');
} catch (error) {
  console.error('❌ Error loading swagger config:', error);
  process.exit(1);
}

// Paths
const generatedApiDir = path.join(__dirname, '../../gwen-generated-api');
const dtosDir = path.join(generatedApiDir, 'src/dtos');
const apisDir = path.join(generatedApiDir, 'src/apis');
const openapiDir = path.join(generatedApiDir, 'openapi');

// Create directories
[dtosDir, apisDir, openapiDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Save OpenAPI spec
const specPath = path.join(openapiDir, 'openapi.json');
fs.writeFileSync(specPath, JSON.stringify(specs, null, 2));
console.log(`✅ OpenAPI specification saved to: ${specPath}`);

// Generate Auth DTOs
const authDtoContent = `/**
 * Auto-generated Auth DTOs from OpenAPI spec
 * Generated at: ${new Date().toISOString()}
 */

export interface UserDTO {
  _id?: string;
  username: string;
  email: string;
  bio: string;
  profilePictureUrl?: string | null;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: UserDTO;
}

export interface ErrorResponseDTO {
  error: string;
}
`;

fs.writeFileSync(path.join(dtosDir, 'auth.dto.ts'), authDtoContent);
console.log('✅ Generated auth.dto.ts');

// Generate User Faction Deck DTOs
const deckDtoContent = `/**
 * Auto-generated UserFactionDeck DTOs from OpenAPI spec
 * Generated at: ${new Date().toISOString()}
 */

export interface UserFactionDeckDTO {
  id?: number;
  user_id: string;
  faction_id: string;
  leader_card_id: string | null;
  unit_card_ids: string[];
  special_card_ids: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserFactionDeckRequestDTO {
  factionId: string;
}

export interface UpdateUserFactionDeckRequestDTO {
  leaderCardId?: string | null;
  unitCardIds?: string[];
  specialCardIds?: string[];
}
`;

fs.writeFileSync(path.join(dtosDir, 'user-faction-deck.dto.ts'), deckDtoContent);
console.log('✅ Generated user-faction-deck.dto.ts');

// Generate DTOs index
const dtosIndexContent = `/**
 * Auto-generated DTOs index
 * Generated at: ${new Date().toISOString()}
 */

export * from './auth.dto';
export * from './user-faction-deck.dto';
`;

fs.writeFileSync(path.join(dtosDir, 'index.ts'), dtosIndexContent);
console.log('✅ Generated dtos/index.ts');

// Generate Auth API
const authApiContent = `/**
 * Auto-generated Auth API client from OpenAPI spec
 * Generated at: ${new Date().toISOString()}
 */

import axios, { AxiosInstance } from 'axios';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '../dtos/index.js';

export class AuthApi {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.apiClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Login user
   * POST /auth/login
   */
  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    const response = await this.apiClient.post<AuthResponseDTO>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Register a new user
   * POST /auth/register
   */
  async register(data: RegisterRequestDTO): Promise<AuthResponseDTO> {
    const response = await this.apiClient.post<AuthResponseDTO>('/auth/register', data);
    return response.data;
  }

  /**
   * Set authorization token for subsequent requests
   */
  setToken(token: string): void {
    this.apiClient.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
  }

  /**
   * Clear authorization token
   */
  clearToken(): void {
    delete this.apiClient.defaults.headers.common['Authorization'];
  }
}
`;

fs.writeFileSync(path.join(apisDir, 'auth.api.ts'), authApiContent);
console.log('✅ Generated auth.api.ts');

// Generate UserFactionDeck API
const deckApiContent = `/**
 * Auto-generated UserFactionDeck API client from OpenAPI spec
 * Generated at: ${new Date().toISOString()}
 */

import axios, { AxiosInstance } from 'axios';
import type {
  UserFactionDeckDTO,
  CreateUserFactionDeckRequestDTO,
  UpdateUserFactionDeckRequestDTO,
} from '../dtos/index.js';

export class UserFactionDeckApi {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.apiClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get all faction decks for a user
   * GET /user/{userId}/decks
   */
  async getUserFactionDecks(userId: string): Promise<UserFactionDeckDTO[]> {
    const response = await this.apiClient.get<UserFactionDeckDTO[]>(\`/user/\${userId}/decks\`);
    return response.data;
  }

  /**
   * Get a specific faction deck for a user
   * GET /user/{userId}/decks/{factionId}
   */
  async getUserFactionDeck(userId: string, factionId: string): Promise<UserFactionDeckDTO> {
    const response = await this.apiClient.get<UserFactionDeckDTO>(
      \`/user/\${userId}/decks/\${factionId}\`,
    );
    return response.data;
  }

  /**
   * Create a new faction deck for a user
   * POST /user/{userId}/decks
   */
  async createUserFactionDeck(
    userId: string,
    data: CreateUserFactionDeckRequestDTO,
  ): Promise<UserFactionDeckDTO> {
    const response = await this.apiClient.post<UserFactionDeckDTO>(\`/user/\${userId}/decks\`, data);
    return response.data;
  }

  /**
   * Update a faction deck
   * PUT /user/{userId}/decks/{factionId}
   */
  async updateUserFactionDeck(
    userId: string,
    factionId: string,
    data: UpdateUserFactionDeckRequestDTO,
  ): Promise<UserFactionDeckDTO> {
    const response = await this.apiClient.put<UserFactionDeckDTO>(
      \`/user/\${userId}/decks/\${factionId}\`,
      data,
    );
    return response.data;
  }

  /**
   * Delete a faction deck
   * DELETE /user/{userId}/decks/{factionId}
   */
  async deleteUserFactionDeck(userId: string, factionId: string): Promise<void> {
    await this.apiClient.delete(\`/user/\${userId}/decks/\${factionId}\`);
  }

  /**
   * Set authorization token for subsequent requests
   */
  setToken(token: string): void {
    this.apiClient.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
  }

  /**
   * Clear authorization token
   */
  clearToken(): void {
    delete this.apiClient.defaults.headers.common['Authorization'];
  }
}
`;

fs.writeFileSync(path.join(apisDir, 'user-faction-deck.api.ts'), deckApiContent);
console.log('✅ Generated user-faction-deck.api.ts');

// Generate APIs index
const apisIndexContent = `/**
 * Auto-generated APIs index
 * Generated at: ${new Date().toISOString()}
 */

export * from './auth.api';
export * from './user-faction-deck.api';
`;

fs.writeFileSync(path.join(apisDir, 'index.ts'), apisIndexContent);
console.log('✅ Generated apis/index.ts');

console.log('\n✅ API client source files generated successfully!');
console.log('\n📊 Artifacts created:');
console.log(`   - OpenAPI spec: openapi/openapi.json`);
console.log(`   - DTOs: src/dtos/`);
console.log(`   - APIs: src/apis/`);
console.log('\n📝 Next steps:');
console.log('   1. Run: npm run build --workspace=gwen-generated-api');
console.log('   2. Your custom src/client.ts and src/index.ts are NOT touched');
console.log('   3. Only src/dtos/ and src/apis/ are regenerated');
console.log('   4. OpenAPI spec is saved for version tracking\n');


