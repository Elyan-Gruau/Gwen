import type { UserService } from './UserService.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import { InvalidCredentialException } from '../exceptions/InvalidCredentialException.js';
import type { DBUser } from '../model/DBUser.js';
import { IllegalUsernameException } from '../exceptions/IllegalUsernameException.js';
import { IllegalEmailException } from '../exceptions/IllegalEmailException.js';
import { DuplicateUsernameException } from '../exceptions/DuplicateUsernameException.js';
import { DuplicateEmailException } from '../exceptions/DuplicateEmailException.js';
import { DTOLoginResponse } from '../dtos/DTOLoginResponse.js';
import type { JwtService } from './JwtService.js';
import type { PasswordHasher } from './PasswordHasher.js';

export class AuthService {
  private static readonly USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
  private static readonly EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@(.+)$/;

  constructor(
    private readonly userService: UserService,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
    private readonly jwtExpiration: number,
  ) {}

  /**
   * Authenticate user and return JWT token
   * @param login - username or email
   * @param password - plain text password
   * @returns DTOLoginResponse containing JWT token and user info
   * @throws InvalidCredentialException if credentials are invalid
   */
  async login(login: string, password: string): Promise<DTOLoginResponse> {
    const user = await this.loginByEmail(login, password);

    const token = this.jwtService.generateToken(user);

    return new DTOLoginResponse(
      token,
      user._id?.toString() || '',
      user.username,
      user.email,
      user.bio || '',
      user.elo || 1200,
    );
  }

  private async loginByEmail(email: string, plainPassword: string): Promise<DBUser> {
    if (!(await this.userService.isEmailTaken(email))) {
      throw new UserNotFoundException(email);
    }

    const user = await this.userService.getUserByEmail(email);
    if (!this.passwordHasher.verifyPassword(plainPassword, user.password)) {
      throw new InvalidCredentialException(email);
    }

    return user;
  }

  async register(username: string, email: string, password: string): Promise<DTOLoginResponse> {
    if (!AuthService.USERNAME_PATTERN.test(username)) {
      throw new IllegalUsernameException(username);
    }

    if (!AuthService.EMAIL_PATTERN.test(email)) {
      throw new IllegalEmailException(email);
    }

    if (await this.userService.isUsernameTaken(username)) {
      throw new DuplicateUsernameException(username);
    }

    if (await this.userService.isEmailTaken(email)) {
      throw new DuplicateEmailException(email);
    }

    const hashedPassword = await this.passwordHasher.hashPassword(password);

    const newUser: DBUser = {
      username,
      email,
      password: hashedPassword,
      bio: '',
      elo: 1200,
    };

    const savedUser = await this.userService.saveUser(newUser);
    const token = this.jwtService.generateToken(savedUser);

    return new DTOLoginResponse(
      token,
      savedUser._id?.toString() || '',
      savedUser.username,
      savedUser.email,
      savedUser.bio || '',
      savedUser.elo || 1200,
    );
  }
}
