import express from 'express';
import authRouter from './features/auth/resources/auth-resource.js';
import userFactionDeckRouter from './features/auth/resources/user-faction-deck-resource.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse json request
app.use(express.json());

// Mount the resources
app.use('/api/auth', authRouter);
app.use('/api/user', userFactionDeckRouter);

// Starting server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
