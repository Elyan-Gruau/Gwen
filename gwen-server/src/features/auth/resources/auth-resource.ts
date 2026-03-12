import { Router } from 'express';
import { AuthService } from '../services/AuthService';

const authRouter = Router();
const authService = new AuthService();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  authService.login(username, password);
});

authRouter.post('/register', (req, res) => {
  const { username, password } = req.body;

  authService.register(username, password);
});

export default authRouter;
