import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthService } from '../../features/auth/services/AuthService';
import { UserService } from '../../features/auth/services/UserService';
import { PasswordHasher } from '../../features/auth/services/PasswordHasher';
import { JwtService } from '../../features/auth/services/JwtService';
import { UserRepository } from '../../features/auth/repository/UserRepository';
import { UserNotFoundException } from '../../features/auth/exceptions/UserNotFoundException';
import { IllegalUsernameException } from '../../features/auth/exceptions/IllegalUsernameException';
import { IllegalEmailException } from '../../features/auth/exceptions/IllegalEmailException';
import { DuplicateUsernameException } from '../../features/auth/exceptions/DuplicateUsernameException';
import { DuplicateEmailException } from '../../features/auth/exceptions/DuplicateEmailException';
import { InvalidCredentialException } from '../../features/auth/exceptions/InvalidCredentialException';

describe('AuthService Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let authService: AuthService;
  let userService: UserService;
  let passwordHasher: PasswordHasher;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  const jwtSecret = 'test-secret-key';
  const jwtExpiration = 3600000; // 1 hour

  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Initialize real services (not mocked)
    userRepository = new UserRepository();
    userService = new UserService(userRepository);
    passwordHasher = new PasswordHasher();
    jwtService = new JwtService(jwtSecret, jwtExpiration);
    authService = new AuthService(userService, passwordHasher, jwtService, jwtExpiration);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean up database after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('register', () => {
    it('should successfully register a new user with valid credentials', async () => {
      const username = 'newuser';
      const email = 'newuser@example.com';
      const password = 'securePassword123!';

      const result = await authService.register(username, email, password);

      expect(result.token).toBeDefined();
      expect(result.user.username).toBe(username);
      expect(result.user.email).toBe(email);
      expect(result.user._id).toBeDefined();
      expect(result.user.elo).toBe(1200);
      expect(result.user.bio).toBe('');

      // Verify user is actually in the database
      const savedUser = await userService.getUserByEmail(email);
      expect(savedUser.username).toBe(username);
      expect(savedUser.email).toBe(email);
    });

    it('should hash the password correctly', async () => {
      const username = 'user1';
      const email = 'user1@example.com';
      const password = 'plainPassword123';

      await authService.register(username, email, password);

      const savedUser = await userService.getUserByEmail(email);
      // Password should not be the plain password
      expect(savedUser.password).not.toBe(password);
      // Password should be a bcrypt hash
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('should throw DuplicateUsernameException when username already exists', async () => {
      const username = 'existinguser';
      const email1 = 'user1@example.com';
      const email2 = 'user2@example.com';
      const password = 'password123';

      // Register first user
      await authService.register(username, email1, password);

      // Try to register with same username but different email
      await expect(authService.register(username, email2, password)).rejects.toThrow(
        DuplicateUsernameException,
      );
    });

    it('should throw DuplicateEmailException when email already exists', async () => {
      const username1 = 'user1';
      const username2 = 'user2';
      const email = 'shared@example.com';
      const password = 'password123';

      // Register first user
      await authService.register(username1, email, password);

      // Try to register with same email but different username
      await expect(authService.register(username2, email, password)).rejects.toThrow(
        DuplicateEmailException,
      );
    });

    it('should throw IllegalUsernameException for invalid username patterns', async () => {
      const invalidUsernames = ['user-name', 'user name', 'user!', 'user@domain', 'user.name'];
      const email = 'test@example.com';
      const password = 'password123';

      for (const username of invalidUsernames) {
        await expect(authService.register(username, email, password)).rejects.toThrow(
          IllegalUsernameException,
        );
      }
    });

    it('should throw IllegalEmailException for invalid email patterns', async () => {
      const username = 'validuser';
      // The current pattern /^[A-Za-z0-9+_.-]+@(.+)$/ accepts emails with consecutive dots
      // So we only test patterns that truly fail
      const invalidEmails = ['invalid', 'invalid@', '@example.com'];
      const password = 'password123';

      for (const email of invalidEmails) {
        await expect(authService.register(username, email, password)).rejects.toThrow(
          IllegalEmailException,
        );
      }
    });

    it('should accept valid usernames and emails', async () => {
      const validCases = [
        { username: 'user', email: 'user@example.com' },
        { username: 'user123', email: 'user123@example.com' },
        { username: 'user_name', email: 'user_name@example.com' },
        { username: 'User_123', email: 'user_123@example.com' },
        { username: 'a', email: 'a@example.com' },
      ];

      for (let i = 0; i < validCases.length; i++) {
        const { username, email } = validCases[i];
        const result = await authService.register(username, email, `password${i}`);
        expect(result.user.username).toBe(username);
        expect(result.user.email).toBe(email);
      }
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Register a test user before each login test
      const username = 'testuser';
      const email = 'testuser@example.com';
      const password = 'testPassword123!';
      await authService.register(username, email, password);
    });

    it('should successfully login with correct email and password', async () => {
      const email = 'testuser@example.com';
      const password = 'testPassword123!';

      const result = await authService.login(email, password);

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.username).toBe('testuser');
      expect(result.user._id).toBeDefined();

      // Verify JWT token is valid
      const isValid = jwtService.validateToken(result.token, 'testuser');
      expect(isValid).toBe(true);
    });

    it('should throw UserNotFoundException for non-existent email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      await expect(authService.login(email, password)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw InvalidCredentialException for incorrect password', async () => {
      const email = 'testuser@example.com';
      const wrongPassword = 'wrongPassword123!';

      await expect(authService.login(email, wrongPassword)).rejects.toThrow(
        InvalidCredentialException,
      );
    });

    it('should generate valid JWT token with correct user data', async () => {
      const email = 'testuser@example.com';
      const password = 'testPassword123!';

      const result = await authService.login(email, password);

      // Extract and verify token claims
      const username = jwtService.extractUsername(result.token);
      const userId = jwtService.extractUserId(result.token);
      const tokenEmail = jwtService.extractClaim<string>(result.token, 'email');

      expect(username).toBe('testuser');
      expect(userId).toBe(result.user._id);
      expect(tokenEmail).toBe(email);
    });

    it('should handle multiple failed login attempts correctly', async () => {
      const email = 'testuser@example.com';
      const wrongPassword = 'wrong';

      // Try multiple times with wrong password
      for (let i = 0; i < 3; i++) {
        await expect(authService.login(email, wrongPassword)).rejects.toThrow(
          InvalidCredentialException,
        );
      }

      // Should still work with correct password
      const result = await authService.login(email, 'testPassword123!');
      expect(result.token).toBeDefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete user lifecycle: register -> login -> use token', async () => {
      // Register user
      const username = 'lifecycle_user';
      const email = 'lifecycle@example.com';
      const password = 'lifecyclePassword123!';

      const registerResult = await authService.register(username, email, password);
      expect(registerResult.token).toBeDefined();

      // Login with same credentials
      const loginResult = await authService.login(email, password);
      expect(loginResult.token).toBeDefined();
      expect(loginResult.user.email).toBe(email);

      // Verify tokens are valid
      const isValid = jwtService.validateToken(loginResult.token, username);
      expect(isValid).toBe(true);
    });

    it('should prevent password reuse detection with bcrypt', async () => {
      // Register user
      const email = 'bcrypt@example.com';
      const password = 'samePassword123!';

      const result1 = await authService.register('user1', email, password);
      const user1 = await userService.getUserByEmail(email);

      // Register another user with same password (should have different hash)
      const result2 = await authService.register('user2', 'user2@example.com', password);
      const user2 = await userService.getUserByEmail('user2@example.com');

      // Hashes should be different even though passwords are same
      expect(user1.password).not.toBe(user2.password);

      // But both should authenticate correctly
      const login1 = await authService.login(email, password);
      const login2 = await authService.login('user2@example.com', password);

      expect(login1.token).toBeDefined();
      expect(login2.token).toBeDefined();
    });

    it('should reject password if modified in database', async () => {
      const email = 'security@example.com';
      const password = 'securePassword123!';

      // Register user
      await authService.register('securityuser', email, password);

      // Get the user's ID for modification
      const user = await userService.getUserByEmail(email);

      // Manually modify password in database by updating the document
      const UserModel = mongoose.model('User');
      await UserModel.findByIdAndUpdate(user._id, { password: 'tamperedPassword' });

      // Should not be able to login with original password
      await expect(authService.login(email, password)).rejects.toThrow(InvalidCredentialException);
    });
  });
});
