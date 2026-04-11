import { AuthService } from '../../features/auth/services/AuthService';
import type { UserService } from '../../features/auth/services/UserService';
import type { PasswordHasher } from '../../features/auth/services/PasswordHasher';
import type { JwtService } from '../../features/auth/services/JwtService';
import { UserNotFoundException } from '../../features/auth/exceptions/UserNotFoundException';
import { IllegalUsernameException } from '../../features/auth/exceptions/IllegalUsernameException';
import { IllegalEmailException } from '../../features/auth/exceptions/IllegalEmailException';
import { DuplicateUsernameException } from '../../features/auth/exceptions/DuplicateUsernameException';
import { DuplicateEmailException } from '../../features/auth/exceptions/DuplicateEmailException';
import type { DBUser } from '../../features/auth/model/DBUser';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: jest.Mocked<UserService>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;
  let mockJwtService: jest.Mocked<JwtService>;

  const mockUser: DBUser = {
    _id: { toString: () => '123' } as any,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    bio: 'Test bio',
    elo: 1200,
  };

  beforeEach(() => {
    mockUserService = {
      isEmailTaken: jest.fn(),
      isUsernameTaken: jest.fn(),
      getUserByEmail: jest.fn(),
      saveUser: jest.fn(),
      getUserById: jest.fn(),
      findUsers: jest.fn(),
      existsByUUID: jest.fn(),
      deleteUser: jest.fn(),
    } as any;

    mockPasswordHasher = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
    } as any;

    mockJwtService = {
      generateToken: jest.fn(),
      extractUsername: jest.fn(),
      extractUserId: jest.fn(),
      extractExpiration: jest.fn(),
      extractClaim: jest.fn(),
      validateToken: jest.fn(),
      isTokenExpired: jest.fn(),
    } as any;

    authService = new AuthService(mockUserService, mockPasswordHasher, mockJwtService, 3600000);
  });

  describe('login', () => {
    it('should throw UserNotFoundException when email is not taken', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password';

      mockUserService.isEmailTaken.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(UserNotFoundException);
      expect(mockUserService.isEmailTaken).toHaveBeenCalledWith(email);
    });
  });

  describe('register', () => {
    it('should successfully register a new user with valid credentials', async () => {
      const username = 'newuser';
      const email = 'newuser@example.com';
      const password = 'plainPassword';
      const hashedPassword = 'hashedPassword';
      const token = 'jwt-token';

      mockUserService.isUsernameTaken.mockResolvedValue(false);
      mockUserService.isEmailTaken.mockResolvedValue(false);
      mockPasswordHasher.hashPassword.mockResolvedValue(hashedPassword);
      mockUserService.saveUser.mockResolvedValue(mockUser);
      mockJwtService.generateToken.mockReturnValue(token);

      const result = await authService.register(username, email, password);

      expect(result.token).toBe(token);
      expect(result.user._id).toBe('123');
      expect(mockUserService.isUsernameTaken).toHaveBeenCalledWith(username);
      expect(mockUserService.isEmailTaken).toHaveBeenCalledWith(email);
      expect(mockPasswordHasher.hashPassword).toHaveBeenCalledWith(password);
      expect(mockUserService.saveUser).toHaveBeenCalled();
    });

    it('should throw IllegalUsernameException for invalid username patterns', async () => {
      const invalidUsernames = ['user-name', 'user name', 'user!', 'user@domain', 'user.name'];

      for (const username of invalidUsernames) {
        await expect(authService.register(username, 'test@example.com', 'password')).rejects.toThrow(
          IllegalUsernameException,
        );
      }
    });

    it('should throw IllegalEmailException for invalid email patterns', async () => {
      const invalidEmails = ['invalid-email', 'invalid@', '@example.com'];

      for (const email of invalidEmails) {
        await expect(authService.register('validuser', email, 'password')).rejects.toThrow(
          IllegalEmailException,
        );
      }
    });

    it('should throw DuplicateUsernameException when username already taken', async () => {
      const username = 'existinguser';
      const email = 'new@example.com';
      const password = 'password';

      mockUserService.isUsernameTaken.mockResolvedValue(true);

      await expect(authService.register(username, email, password)).rejects.toThrow(
        DuplicateUsernameException,
      );
    });

    it('should throw DuplicateEmailException when email already taken', async () => {
      const username = 'newuser';
      const email = 'existing@example.com';
      const password = 'password';

      mockUserService.isUsernameTaken.mockResolvedValue(false);
      mockUserService.isEmailTaken.mockResolvedValue(true);

      await expect(authService.register(username, email, password)).rejects.toThrow(
        DuplicateEmailException,
      );
    });

    it('should accept valid usernames', async () => {
      const validUsernames = ['user', 'user123', 'user_name', 'User_123'];

      for (const username of validUsernames) {
        mockUserService.isUsernameTaken.mockResolvedValue(false);
        mockUserService.isEmailTaken.mockResolvedValue(false);
        mockPasswordHasher.hashPassword.mockResolvedValue('hashed');
        mockUserService.saveUser.mockResolvedValue(mockUser);
        mockJwtService.generateToken.mockReturnValue('token');

        await expect(authService.register(username, 'test@example.com', 'password')).resolves.toBeDefined();
      }
    });
  });
});

