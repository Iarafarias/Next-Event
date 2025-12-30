import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { setupSwagger } from './infrastructure/swagger/swagger';
import logger from './infrastructure/logger/logger';
import cors from 'cors';
import path from 'path';
import { requestLogger } from './presentation/middlewares/requestLogger';
import { userRoutes } from './presentation/user/routes/userRoutes';
import { certificateRoutes } from './presentation/certificate/routes/certificateRoutes';
import { alocarTutorAlunoRoutes } from './presentation/alocarTutorAluno/routes/alocarTutorAlunoRoutes';
import { cargaHorariaMinimaRoutes } from './presentation/cargaHorariaMinima/routes';
import { relatorioAcompanhamentoRoutes } from './presentation/relatorioAcompanhamento/routes/relatorioAcompanhamentoRoutes';
import { relatorioAvaliacaoRoutes } from './presentation/relatorioAvaliacao/routes/relatorioAvaliacaoRoutes';
import { relatorioCertificadoRoutes } from './presentation/relatorioCertificado/routes/relatorioCertificadoRoutes';
import { relatorioTutorRoutes } from './presentation/relatorioTutor/routes/relatorioTutorRoutes';
import { relatorioAlunoRoutes } from './presentation/relatorioAluno/routes/relatorioAlunoRoutes';
import { relatorioRoutes } from './presentation/relatorio/routes/relatorioRoutes';
import { formAcompanhamentoRoutes } from './presentation/formAcompanhamento/routes/formAcompanhamentoRoutes';
import { periodoTutoriaRoutes } from './presentation/periodoTutoria/routes/periodoTutoriaRoutes';
import { notificationRoutes } from './presentation/notification/routes/notificationRoutes';

const app = express();
setupSwagger(app);
logger.info('Servidor Next-Event inicializando...');

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
app.use(requestLogger);

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

app.use('/api/relatorios', relatorioRoutes);
app.use('/api/relatorio-aluno', relatorioAlunoRoutes);
app.use('/api/relatorio-tutor', relatorioTutorRoutes);
app.use('/api/relatorio-certificado', relatorioCertificadoRoutes);
app.use('/api/relatorio-acompanhamento', relatorioAcompanhamentoRoutes);
app.use('/api/relatorio-avaliacao', relatorioAvaliacaoRoutes);
app.use('/api/form-acompanhamento', formAcompanhamentoRoutes);
app.use('/api/periodo-tutoria', periodoTutoriaRoutes);
app.use('/api/alocar-tutor-aluno', alocarTutorAlunoRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/carga-horaria-minima', cargaHorariaMinimaRoutes);


import { errorHandler } from './presentation/middlewares/errorHandler';

app.use(errorHandler);


import * as net from 'net';

function findFreePort(startPort: number, cb: (port: number) => void) {
  const server = net.createServer();
  server.unref();
  server.on('error', () => findFreePort(startPort + 1, cb));
  server.listen(startPort, () => {
    const port = (server.address() as any).port;
    server.close(() => cb(port));
  });
}

const desiredPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
findFreePort(desiredPort, (PORT) => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
