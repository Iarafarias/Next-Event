import { INotificationRepository } from '../../../domain/notification/repositories/INotificationRepository';

export class MarkNotificationAsReadUseCase {
  constructor(
    private notificationRepository: INotificationRepository
  ) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notificação não encontrada');
    }

    if (notification.userId !== userId) {
      throw new Error('Não autorizado a marcar esta notificação como lida');
    }

    await this.notificationRepository.markAsRead(notificationId);
  }
}
