import { INotificationRepository } from '../../../domain/notification/repositories/INotificationRepository';
import { Notification } from '../../../domain/notification/entities/Notification';

export class GetNotificationsByUserUseCase {
  constructor(
    private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    if (unreadOnly) {
      return await this.notificationRepository.findUnreadByUserId(userId);
    }
    
    return await this.notificationRepository.findByUserId(userId);
  }
}
