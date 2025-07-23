import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  findUnreadByUserId(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsReadByUserId(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
  deleteExpired(expirationDays?: number): Promise<void>;
  countUnreadByUserId(userId: string): Promise<number>;
}
