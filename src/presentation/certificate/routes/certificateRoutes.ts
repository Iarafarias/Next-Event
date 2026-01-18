import { Router } from 'express';
import multer from 'multer';
import { body, param } from 'express-validator';
import { CertificateController } from '../controllers/CertificateController';
import { ValidarCertificadoPorCoordenadorController } from '../controllers/ValidarCertificadoPorCoordenadorController';
import { EmitirCertificadoPorTutorController } from '../controllers/EmitirCertificadoPorTutorController';
import { SolicitarCertificadoPorBolsistaController } from '../controllers/SolicitarCertificadoPorBolsistaController';
import { ListCertificadosPorCoordenadorController } from '../controllers/ListCertificadosPorCoordenadorController';
import { ListCertificadosPorTutorController } from '../controllers/ListCertificadosPorTutorController';
import { ListCertificadosPorBolsistaController } from '../controllers/ListCertificadosPorBolsistaController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import logger from '../../../infrastructure/logger/logger';
import { ValidarCertificadoPorCoordenadorUseCase } from '../../../application/certificate/use-cases/ValidarCertificadoPorCoordenadorUseCase';
import { EmitirCertificadoPorTutorUseCase } from '../../../application/certificate/use-cases/EmitirCertificadoPorTutorUseCase';
import { SolicitarCertificadoPorBolsistaUseCase } from '../../../application/certificate/use-cases/SolicitarCertificadoPorBolsistaUseCase';
import { ListCertificadosPorCoordenadorUseCase } from '../../../application/certificate/use-cases/ListCertificadosPorCoordenadorUseCase';
import { ListCertificadosPorTutorUseCase } from '../../../application/certificate/use-cases/ListCertificadosPorTutorUseCase';
import { ListCertificadosPorBolsistaUseCase } from '../../../application/certificate/use-cases/ListCertificadosPorBolsistaUseCase';
import { UploadCertificateUseCase } from '../../../application/certificate/use-cases/UploadCertificateUseCase';
import { SetReferenceMonthUseCase } from '../../../application/certificate/use-cases/SetReferenceMonthUseCase';
import { GenerateReportUseCase } from '../../../application/certificate/use-cases/GenerateReportUseCase';
import { PostgresCertificateRepository } from '../../../infrastructure/certificate/repositories/postgresCertificateRepository';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { PDFProcessorService } from '../../../infrastructure/certificate/services/PDFProcessorService';
import { StorageService } from '../../../infrastructure/certificate/services/StorageService';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { Request, Response } from 'express';

const certificateRoutes = Router();

const certificateRepository: ICertificateRepository = new PostgresCertificateRepository();
const pdfProcessor = new PDFProcessorService();
const storageService = new StorageService();


const uploadCertificateUseCase = new UploadCertificateUseCase(
  certificateRepository,
  pdfProcessor,
  storageService
);
const setReferenceMonthUseCase = new SetReferenceMonthUseCase();
const generateReportUseCase = new GenerateReportUseCase(certificateRepository);

const validarCertificadoPorCoordenadorController =
  new ValidarCertificadoPorCoordenadorController(
    new ValidarCertificadoPorCoordenadorUseCase(certificateRepository)
  );

const emitirCertificadoPorTutorController =
  new EmitirCertificadoPorTutorController(
    new EmitirCertificadoPorTutorUseCase(certificateRepository)
  );

const solicitarCertificadoPorBolsistaController =
  new SolicitarCertificadoPorBolsistaController(
    new SolicitarCertificadoPorBolsistaUseCase(certificateRepository)
  );

const listCertificadosPorCoordenadorController =
  new ListCertificadosPorCoordenadorController(
    new ListCertificadosPorCoordenadorUseCase(certificateRepository)
  );

const listCertificadosPorTutorController =
  new ListCertificadosPorTutorController(
    new ListCertificadosPorTutorUseCase(certificateRepository)
  );

const listCertificadosPorBolsistaController =
  new ListCertificadosPorBolsistaController(
    new ListCertificadosPorBolsistaUseCase(certificateRepository)
  );

const certificateController = new CertificateController(
  uploadCertificateUseCase,
  generateReportUseCase,
  setReferenceMonthUseCase,
  storageService,
  pdfProcessor
);

const upload = multer({
  dest: 'uploads/',
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

certificateRoutes.post(
  '/coordenadores/:id/validar-certificado',
  authMiddleware,
  authorizeRoles(['coordinator', 'admin']),
  [
    param('id').isString().notEmpty(),
    body('certificateId').isString().notEmpty(),
    validationMiddleware
  ],
  (req: Request, res: Response) => {
    logger.info('Validar certificado por coordenador', { user: req.user });
    validarCertificadoPorCoordenadorController.handle(req, res);
  }
);

certificateRoutes.post(
  '/tutores/:id/emitir-certificado',
  authMiddleware,
  authorizeRoles(['tutor', 'admin']),
  [
    param('id').isString().notEmpty(),
    body('certificateId').isString().notEmpty(),
    validationMiddleware
  ],
  (req: Request, res: Response) => {
    logger.info('Emitir certificado por tutor', { user: req.user });
    emitirCertificadoPorTutorController.handle(req, res);
  }
);

certificateRoutes.post(
  '/bolsistas/:id/solicitar-certificado',
  authMiddleware,
  authorizeRoles(['scholarship_holder', 'admin']),
  [
    param('id').isString().notEmpty(),
    body('certificateId').isString().notEmpty(),
    validationMiddleware
  ],
  (req: Request, res: Response) => {
    logger.info('Solicitar certificado por bolsista', { user: req.user });
    solicitarCertificadoPorBolsistaController.handle(req, res);
  }
);

certificateRoutes.get(
  '/coordenadores/:id/certificados',
  authMiddleware,
  authorizeRoles(['coordinator', 'admin']),
  (req: Request, res: Response) => listCertificadosPorCoordenadorController.handle(req, res)
);

certificateRoutes.get(
  '/tutores/:id/certificados',
  authMiddleware,
  authorizeRoles(['tutor', 'admin']),
  (req: Request, res: Response) => listCertificadosPorTutorController.handle(req, res)
);

certificateRoutes.get(
  '/bolsistas/:id/certificados',
  authMiddleware,
  authorizeRoles(['scholarship_holder', 'admin']),
  (req: Request, res: Response) => listCertificadosPorBolsistaController.handle(req, res)
);

certificateRoutes.post(
  '/reference-month',
  authMiddleware,
  authorizeRoles(['admin', 'coordinator']),
  (req: Request, res: Response) => certificateController.setReferenceMonth(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/reference-month',
  authMiddleware,
  authorizeRoles(['admin', 'student', 'coordinator']),
  (req: Request, res: Response) => certificateController.getCurrentReferenceMonth(req as AuthenticatedRequest, res)
);

certificateRoutes.post(
  '/upload',
  authMiddleware,
  authorizeRoles(['student']),
  upload.single('certificate'),
  (req: Request, res: Response) => certificateController.upload(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/user/:userId',
  authMiddleware,
  (req: Request, res: Response) => certificateController.listUserCertificates(req, res)
);

certificateRoutes.patch(
  '/:id/status',
  authMiddleware,
  authorizeRoles(['admin']),
  [
    param('id').isString().notEmpty(),
    body('status').isString().notEmpty(),
    validationMiddleware
  ],
  (req: Request, res: Response) => certificateController.updateStatus(req, res)
);

certificateRoutes.delete(
  '/:id',
  authMiddleware,
  [param('id').isString().notEmpty(), validationMiddleware],
  (req: Request, res: Response) => certificateController.delete(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/:id/download',
  authMiddleware,
  (req: Request, res: Response) => certificateController.downloadCertificate(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/report',
  authMiddleware,
  authorizeRoles(['student']),
  (req: Request, res: Response) => certificateController.generateReport(req as AuthenticatedRequest, res)
);

certificateRoutes.get(
  '/report/:userId',
  authMiddleware,
  authorizeRoles(['admin']),
  (req: Request, res: Response) => certificateController.generateReport(req as AuthenticatedRequest, res)
);

export { certificateRoutes };
