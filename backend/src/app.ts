import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import catFactsRoutes from './routes/catfacts.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // La URL de tu Vite React App
    credentials: true, // Si usas cookies o cabeceras de autorización
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facts', catFactsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
