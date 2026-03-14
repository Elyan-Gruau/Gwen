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

authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await authService.login(username, password);
    res.json(response);
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

authRouter.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const response = await authService.register(username, email, password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

export default authRouter;
