import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { GetNotificationsByUserUseCase } from '../../../application/notification/use-cases/GetNotificationsByUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/notification/use-cases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../../application/notification/use-cases/MarkAllNotificationsAsReadUseCase';
import { GetUnreadNotificationCountUseCase } from '../../../application/notification/use-cases/GetUnreadNotificationCountUseCase';
import { PostgresNotificationRepository } from '../../../infrastructure/notification/repositories/PostgresNotificationRepository';
import { authMiddleware } from '../../middlewares/authMiddleware';

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

router.get('/', (req, res) => notificationController.getMyNotifications(req, res));

router.get('/unread-count', (req, res) => notificationController.getUnreadCount(req, res));

router.patch('/:id/read', (req, res) => notificationController.markAsRead(req, res));

router.patch('/mark-all-read', (req, res) => notificationController.markAllAsRead(req, res));

export { router as notificationRoutes };
