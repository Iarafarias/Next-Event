import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { GetNotificationsByUserUseCase } from '../../../application/notification/use-cases/GetNotificationsByUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/notification/use-cases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../../application/notification/use-cases/MarkAllNotificationsAsReadUseCase';
import { GetUnreadNotificationCountUseCase } from '../../../application/notification/use-cases/GetUnreadNotificationCountUseCase';
import { PostgresNotificationRepository } from '../../../infrastructure/notification/repositories/PostgresNotificationRepository';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Configuração das dependências
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

// Rotas protegidas - requerem autenticação
router.use(authMiddleware);

// GET /notifications - Buscar notificações do usuário
// Query params: unread=true para buscar apenas não lidas
router.get('/', (req, res) => notificationController.getMyNotifications(req, res));

// GET /notifications/unread-count - Contar notificações não lidas
router.get('/unread-count', (req, res) => notificationController.getUnreadCount(req, res));

// PATCH /notifications/:id/read - Marcar notificação específica como lida
router.patch('/:id/read', (req, res) => notificationController.markAsRead(req, res));

// PATCH /notifications/mark-all-read - Marcar todas as notificações como lidas
router.patch('/mark-all-read', (req, res) => notificationController.markAllAsRead(req, res));

export { router as notificationRoutes };
