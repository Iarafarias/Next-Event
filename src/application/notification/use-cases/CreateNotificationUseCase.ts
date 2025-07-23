import { INotificationRepository } from '../../../domain/notification/repositories/INotificationRepository';
import { Notification, NotificationType } from '../../../domain/notification/entities/Notification';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository
  ) {}

  async execute(data: CreateNotificationData): Promise<Notification> {
    const notification = new Notification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedEntityId: data.relatedEntityId,
      relatedEntityType: data.relatedEntityType,
    });

    return await this.notificationRepository.create(notification);
  }
}
