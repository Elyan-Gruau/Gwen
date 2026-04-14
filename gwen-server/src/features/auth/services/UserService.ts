import { UserRepository } from '../repository/UserRepository.js';
import type { DBUser } from '../model/DBUser.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';

export interface PaginatedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  limit: number;
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<DBUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  /**
   * Get user by email
   * @param email - the email
   * @returns the user
   * @throws UserNotFoundException if the user is not found
   */
  async getUserByEmail(email: string): Promise<DBUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }
    return user;
  }

  /**
   * Get user by username
   * @param username - the username
   * @returns the user
   * @throws UserNotFoundException if the user is not found
   */
  async getUserByUsername(username: string): Promise<DBUser> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    return this.userRepository.existsByUsername(username);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async saveUser(user: DBUser): Promise<DBUser> {
    return this.userRepository.save(user);
  }

  async findUsers(
    username: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<DBUser>> {
    const result = await this.userRepository.findByUsernameStartingWith(username, {
      page: offset,
      limit,
    });

    return {
      content: result.content,
      totalElements: result.totalElements,
      totalPages: Math.ceil(result.totalElements / limit),
      page: offset,
      limit,
    };
  }

  async existsByUUID(uuid: string): Promise<boolean> {
    return this.userRepository.existsById(uuid);
  }

  async deleteUser(id: string): Promise<void> {
    if (!(await this.userRepository.existsById(id))) {
      throw new UserNotFoundException(id);
    }
    await this.userRepository.deleteById(id);
  }

  async setFavoriteDeck(userId: string, factionId: string | null): Promise<DBUser> {
    const user = await this.getUserById(userId);
    user.favorite_deck = factionId;
    return this.userRepository.update(user);
  }

  async getFavoriteDeck(userId: string): Promise<string | null | undefined> {
    const user = await this.getUserById(userId);
    return user.favorite_deck;
  }
}
