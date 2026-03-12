import express from 'express';
import authRouter from './features/auth/resources/auth-resource';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse json request
app.use(express.json());

// Mount the resources
app.use('/api/auth', authRouter);

// Starting server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
