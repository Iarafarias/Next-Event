import { Router } from 'express';
import { CertificateController } from '../controllers/CertificateController';
import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated';
import { authorizeRoles } from '../../middlewares/authorizeRoles';

const certificateRoutes = Router();
const certificateController = new CertificateController();

// Rotas para participantes
certificateRoutes.post(
  '/',
  ensureAuthenticated,
  authorizeRoles(['participant' as const]),
  certificateController.create.bind(certificateController)
);

certificateRoutes.get(
  '/user/:userId',
  ensureAuthenticated,
  certificateController.listUserCertificates.bind(certificateController)
);

// Rotas para administradores
certificateRoutes.patch(
  '/:id/status',
  ensureAuthenticated,
  authorizeRoles(['admin' as const]),
  certificateController.updateStatus.bind(certificateController)
);

certificateRoutes.get(
  '/report/:userId',
  ensureAuthenticated,
  authorizeRoles(['admin' as const]),
  certificateController.generateReport.bind(certificateController)
);

export { certificateRoutes }; 