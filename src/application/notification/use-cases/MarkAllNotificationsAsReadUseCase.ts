import { INotificationRepository } from '../../../domain/notification/repositories/INotificationRepository';

export class MarkAllNotificationsAsReadUseCase {
  constructor(
    private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsReadByUserId(userId);
  }
}
