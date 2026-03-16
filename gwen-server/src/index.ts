import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRouter from './features/auth/resources/auth-resource.js';
import userFactionDeckRouter from './features/auth/resources/user-faction-deck-resource.js';

const app = express();
const PORT = process.env.PORT || 3000;

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

// Starting server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
