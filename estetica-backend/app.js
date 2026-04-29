import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());

// --- RUTAS ---
app.use('/api/auth', authRoutes);

// --- TEST ---
app.get('/', (req, res) => {
  res.send('API de Espacio Senda funcionando correctamente');
});

// --- SERVIDOR ---
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});