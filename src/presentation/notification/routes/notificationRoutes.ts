import { Router } from 'express';
import { Request, Response } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { GetNotificationsByUserUseCase } from '../../../application/notification/use-cases/GetNotificationsByUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/notification/use-cases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../../application/notification/use-cases/MarkAllNotificationsAsReadUseCase';
import { GetUnreadNotificationCountUseCase } from '../../../application/notification/use-cases/GetUnreadNotificationCountUseCase';
import { PostgresNotificationRepository } from '../../../infrastructure/notification/repositories/PostgresNotificationRepository';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

const router = Router();

const notificationRepository = new PostgresNotificationRepository();

const getNotificationsByUserUseCase = new GetNotificationsByUserUseCase(notificationRepository);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const markAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);
const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(notificationRepository);

const notificationController = new NotificationController(
  getNotificationsByUserUseCase,
  markNotificationAsReadUseCase,
  markAllNotificationsAsReadUseCase,
  getUnreadNotificationCountUseCase
);

router.use(authMiddleware);

router.get('/', (req: Request, res: Response) => notificationController.getMyNotifications(req, res));

router.get('/unread-count', (req: Request, res: Response) => notificationController.getUnreadCount(req, res));

router.patch(
  '/:id/read',
  [param('id').isString().notEmpty(), validationMiddleware],
  (req: Request, res: Response) => notificationController.markAsRead(req, res)
);

router.patch('/mark-all-read', (req: Request, res: Response) => notificationController.markAllAsRead(req, res));

export { router as notificationRoutes };
