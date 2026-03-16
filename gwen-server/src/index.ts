import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRouter from './features/auth/resources/auth-resource.js';
import userFactionDeckRouter from './features/auth/resources/user-faction-deck-resource.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://gwen-user:gwen-password@localhost:27017/gwen-db?authSource=admin';

// Middleware to parse json request
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

// Initialize MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connecté');
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
}

startServer();

