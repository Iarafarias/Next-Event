import { Router, Request } from 'express';
import multer from 'multer';
import { CertificateController } from '../controllers/CertificateController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { UploadCertificateUseCase } from '../../../application/certificate/use-cases/UploadCertificateUseCase';
import { GenerateReportUseCase } from '../../../application/certificate/use-cases/GenerateReportUseCase';
import { SetReferenceMonthUseCase } from '../../../application/certificate/use-cases/SetReferenceMonthUseCase';
import { PostgresCertificateRepository } from '../../../infrastructure/certificate/repositories/postgresCertificateRepository';
import { PDFProcessorService } from '../../../infrastructure/certificate/services/PDFProcessorService';
import { StorageService } from '../../../infrastructure/certificate/services/StorageService';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

const certificateRoutes = Router();

// Initialize dependencies
const certificateRepository = new PostgresCertificateRepository();
const pdfProcessor = new PDFProcessorService();
const storageService = new StorageService();
const setReferenceMonthUseCase = new SetReferenceMonthUseCase();

const uploadCertificateUseCase = new UploadCertificateUseCase(
  certificateRepository,
  pdfProcessor,
  storageService
);

const generateReportUseCase = new GenerateReportUseCase(certificateRepository);

const certificateController = new CertificateController(
  uploadCertificateUseCase,
  generateReportUseCase,
  setReferenceMonthUseCase,
  storageService,
  pdfProcessor
);

certificateRoutes.post(
  '/reference-month',
  authMiddleware,
  authorizeRoles(['admin']),
  (req, res) => certificateController.setReferenceMonth(req as AuthenticatedRequest, res)
);

certificateRoutes.post(
  '/upload',
  authMiddleware,
  authorizeRoles(['participant']),
  upload.single('certificate'),
  (req, res) => certificateController.upload(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/user/:userId',
  authMiddleware,
  (req, res) => certificateController.listUserCertificates(req, res)
);

certificateRoutes.get(
  '/',
  authMiddleware,
  authorizeRoles(['admin']),
  (req, res) => certificateController.listUserCertificates(req, res)
);

certificateRoutes.patch(
  '/:id/status',
  authMiddleware,
  authorizeRoles(['admin']),
  (req, res) => certificateController.updateStatus(req, res)
);

certificateRoutes.delete(
  '/:id',
  authMiddleware,
  (req, res) => certificateController.delete(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/report',
  authMiddleware,
  authorizeRoles(['participant']),
  (req, res) => certificateController.generateReport(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/report/:userId',
  authMiddleware,
  authorizeRoles(['admin']),
  (req, res) => certificateController.generateReport(req as AuthenticatedRequest, res)
);

export { certificateRoutes }; 