import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { userRoutes } from './presentation/user/routes/userRoutes';
import { certificateRoutes } from './presentation/certificate/routes/certificateRoutes';
import { notificationRoutes } from './presentation/notification/routes/notificationRoutes';

const app = express();

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
