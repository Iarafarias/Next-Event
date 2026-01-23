import { Router, Request, Response } from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import logger from '../../../infrastructure/logger/logger';

// Use apenas o que for necessário para as rotas básicas
const certificateRoutes = Router();

// Configuração do multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF ou imagens são permitidos'));
    }
  }
});

// Todas as rotas requerem autenticação
certificateRoutes.use(authMiddleware);

// Rota básica de upload de certificado
certificateRoutes.post(
  '/upload',
  upload.single('file'),
  (req: Request, res: Response) => {
    logger.info('POST /certificates/upload - Upload de certificado', { user: (req as any).user });
    res.status(200).json({ message: 'Upload realizado com sucesso' });
  }
);

// Rota para listar certificados do usuário
certificateRoutes.get(
  '/user/:userId',
  authMiddleware,
  (req: Request, res: Response) => {
    logger.info('Listar certificados do usuário', { userId: req.params.userId });
    res.status(200).json({ certificados: [] });
  }
);

// Rota para atualizar status - deve estar antes de /:id
certificateRoutes.patch(
  '/:id/status',
  authMiddleware,
  authorizeRoles(['admin']),
  [param('id').isString().notEmpty(), body('status').isString().notEmpty(), validationMiddleware],
  (req: Request, res: Response) => {
    logger.info('Atualizar status do certificado', { id: req.params.id, status: req.body.status });
    res.status(200).json({ message: 'Status atualizado' });
  }
);

// Rota para deletar certificado
certificateRoutes.delete(
  '/:id',
  authMiddleware,
  (req: Request, res: Response) => {
    logger.info('Deletar certificado', { id: req.params.id });
    res.status(200).json({ message: 'Certificado deletado' });
  }
);

// Rota para download
certificateRoutes.get(
  '/:id/download',
  authMiddleware,
  (req: Request, res: Response) => {
    logger.info('Download do certificado', { id: req.params.id });
    res.status(200).json({ message: 'Download iniciado' });
  }
);

// Rota para gerar relatório
certificateRoutes.get(
  '/report',
  authMiddleware,
  authorizeRoles(['student']),
  (req: Request, res: Response) => {
    logger.info('Gerar relatório de certificados', { user: (req as any).user });
    res.status(200).json({ message: 'Relatório gerado' });
  }
);

certificateRoutes.get(
  '/report/:userId',
  authMiddleware,
  authorizeRoles(['admin']),
  (req: Request, res: Response) => {
    logger.info('Gerar relatório de certificados para usuário', { userId: req.params.userId });
    res.status(200).json({ message: 'Relatório gerado' });
  }
);

export { certificateRoutes };