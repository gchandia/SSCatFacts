import express from 'express';
import authRoutes from './routes/auth.routes';
import catFactsRoutes from './routes/catfacts.routes';
import userRoutes from './routes/user.routes';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facts', catFactsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
