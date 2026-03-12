import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse json request
app.use(express.json());

// Exemple de route structurée
app.get('/api/template', (req, res) => {
  res.json({
    message: 'Ceci est une route template structurée.',
    success: true,
  });
});

// Starting server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
