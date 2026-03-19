import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { specs } from './config/swagger.js';
import authRouter from './features/auth/resources/auth-resource.js';
import userFactionDeckRouter from './features/auth/resources/user-faction-deck-resource.js';
import { initializeMatchmaking } from './features/index.js';
import { UserService } from './features/auth/services/UserService.js';
import { UserRepository } from './features/auth/repository/UserRepository.js';
import { GameService } from './features/game/services/GameService.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://gwen-user:gwen-password@localhost:27017/gwen-db?authSource=admin';

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Swagger/OpenAPI documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs));
app.get('/api/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Mount the resources
app.use('/api/auth', authRouter);
app.use('/api/user', userFactionDeckRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// WebSockets setup
app.locals.io = io;

// Initialize MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Initialize services
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const gameService = new GameService();

    // Initialize matchmaking system
    initializeMatchmaking(io, userService, gameService);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

startServer();
