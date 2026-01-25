import { Router, Request, Response } from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import logger from '../../../infrastructure/logger/logger';
import { CertificateController } from '../controllers/CertificateController';
import { UploadCertificateUseCase } from '../../../application/certificate/use-cases/UploadCertificateUseCase';
import { GenerateReportUseCase } from '../../../application/certificate/use-cases/GenerateReportUseCase';
import { SetReferenceMonthUseCase } from '../../../application/certificate/use-cases/SetReferenceMonthUseCase';
import { PostgresCertificateRepository } from '../../../infrastructure/certificate/repositories/postgresCertificateRepository';
import { StorageService } from '../../../infrastructure/certificate/services/StorageService';
import { PDFProcessorService } from '../../../infrastructure/certificate/services/PDFProcessorService';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

const certificateRoutes = Router();

// Injeção de Dependências
const repository = new PostgresCertificateRepository();
const storageService = new StorageService();
const pdfProcessor = new PDFProcessorService();

const uploadCertificateUseCase = new UploadCertificateUseCase(repository, pdfProcessor, storageService);
const generateReportUseCase = new GenerateReportUseCase(repository);
const setReferenceMonthUseCase = new SetReferenceMonthUseCase();

const controller = new CertificateController(
  uploadCertificateUseCase,
  generateReportUseCase,
  setReferenceMonthUseCase,
  storageService,
  pdfProcessor
);


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF ou imagens são permitidos'));
    }
  }
});

certificateRoutes.use(authMiddleware);

certificateRoutes.post('/upload', upload.single('file'), (req: Request, res: Response) => controller.upload(req as AuthenticatedRequest, res));
certificateRoutes.get('/', authorizeRoles(['admin', 'coordinator']), (req: Request, res: Response) => controller.listAll(req as AuthenticatedRequest, res));
certificateRoutes.get('/user/:userId', (req: Request, res: Response) => controller.listUserCertificates(req, res));
certificateRoutes.get('/:id/download', (req: Request, res: Response) => controller.downloadCertificate(req as AuthenticatedRequest, res));
certificateRoutes.patch('/:id/status', authorizeRoles(['admin', 'coordinator']), (req: Request, res: Response) => controller.updateStatus(req, res));

certificateRoutes.delete('/:id', (req: Request, res: Response) => controller.delete(req as AuthenticatedRequest, res));

certificateRoutes.get('/report', authorizeRoles(['student']), (req: Request, res: Response) => controller.generateReport(req as AuthenticatedRequest, res));
certificateRoutes.get('/report/:userId', authorizeRoles(['admin']), (req: Request, res: Response) => controller.generateReport(req as AuthenticatedRequest, res));

export { certificateRoutes };