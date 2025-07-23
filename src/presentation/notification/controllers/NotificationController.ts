import { Request, Response } from 'express';
import { GetNotificationsByUserUseCase } from '../../../application/notification/use-cases/GetNotificationsByUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/notification/use-cases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../../application/notification/use-cases/MarkAllNotificationsAsReadUseCase';
import { GetUnreadNotificationCountUseCase } from '../../../application/notification/use-cases/GetUnreadNotificationCountUseCase';

export class NotificationController {
  constructor(
    private getNotificationsByUserUseCase: GetNotificationsByUserUseCase,
    private markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    private getUnreadNotificationCountUseCase: GetUnreadNotificationCountUseCase
  ) {}

  async getMyNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const unreadOnly = req.query.unread === 'true';
      const notifications = await this.getNotificationsByUserUseCase.execute(userId, unreadOnly);

      res.json({
        notifications: notifications.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          status: notification.status,
          relatedEntityId: notification.relatedEntityId,
          relatedEntityType: notification.relatedEntityType,
          createdAt: notification.createdAt,
          readAt: notification.readAt,
        }))
      });
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const { id } = req.params;
      await this.markNotificationAsReadUseCase.execute(id, userId);

      res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Notificação não encontrada') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === 'Não autorizado a marcar esta notificação como lida') {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      await this.markAllNotificationsAsReadUseCase.execute(userId);

      res.json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const count = await this.getUnreadNotificationCountUseCase.execute(userId);

      res.json({ count });
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações não lidas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
