import { INotificationRepository } from '../../../domain/notification/repositories/INotificationRepository';

export class GetUnreadNotificationCountUseCase {
  constructor(
    private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<number> {
    return await this.notificationRepository.countUnreadByUserId(userId);
  }
}
