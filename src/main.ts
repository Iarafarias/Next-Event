import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { userRoutes } from './presentation/user/routes/userRoutes';

const app = express();

app.use(cors()); 

app.use(express.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
