import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/auth.routes.js';
import usersRoutes from './src/routes/users.routes.js';
import professionalsRoutes from './src/routes/professionals.routes.js';
import servicesRoutes from './src/routes/services.routes.js';
import appointmentsRoutes from './src/routes/appointments.routes.js';
import reportsRoutes from './src/routes/reports.routes.js';


const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/reports', reportsRoutes);

// --- TEST ---
app.get('/', (req, res) => {
  res.send('API de Espacio Senda funcionando correctamente');
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

// --- SERVIDOR ---

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});