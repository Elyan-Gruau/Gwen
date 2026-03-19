import { Router } from 'express';
import { AuthService } from '../services/AuthService.js';
import { UserService } from '../services/UserService.js';
import { PasswordHasher } from '../services/PasswordHasher.js';
import { JwtService } from '../services/JwtService.js';
import { UserRepository } from '../repository/UserRepository.js';

const authRouter = Router();

// Initialize services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const passwordHasher = new PasswordHasher();
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const jwtExpiration = parseInt(process.env.JWT_EXPIRATION || '3600000', 10); // 1 hour by default
const jwtService = new JwtService(jwtSecret, jwtExpiration);
const authService = new AuthService(userService, passwordHasher, jwtService, jwtExpiration);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await authService.login(username, password);
    res.json(response);
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const response = await authService.register(username, email, password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId as string;
    const user = await userService.getUserById(userId);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl,
      elo: user.elo,
    });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

export default authRouter;
