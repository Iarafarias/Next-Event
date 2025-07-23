import { PrismaClient } from '@prisma/client';
import { INotificationRepository } from '../../../domain/notification/repositories/INotificationRepository';
import { Notification } from '../../../domain/notification/entities/Notification';

export class PostgresNotificationRepository implements INotificationRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(notification: Notification): Promise<Notification> {
    const createdNotification = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        status: notification.status,
        relatedEntityId: notification.relatedEntityId,
        relatedEntityType: notification.relatedEntityType,
        createdAt: notification.createdAt,
      }
    });

    return this.mapToNotification(createdNotification);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id }
    });
    
    return notification ? this.mapToNotification(notification) : null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return notifications.map(this.mapToNotification);
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { 
        userId,
        status: 'unread'
      },
      orderBy: { createdAt: 'desc' }
    });

    return notifications.map(this.mapToNotification);
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { 
        status: 'read',
        readAt: new Date()
      }
    });
  }

  async markAllAsReadByUserId(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId },
      data: { 
        status: 'read',
        readAt: new Date()
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id }
    });
  }

  async deleteExpired(expirationDays: number = 30): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - expirationDays);

    await this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: expirationDate
        }
      }
    });
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return await this.prisma.notification.count({
      where: { 
        userId,
        status: 'unread'
      }
    });
  }

  private mapToNotification(data: any): Notification {
    const notification = new Notification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedEntityId: data.relatedEntityId,
      relatedEntityType: data.relatedEntityType,
    });
    
    notification.id = data.id;
    notification.status = data.status;
    notification.createdAt = data.createdAt;
    notification.readAt = data.readAt;
    
    return notification;
  }
}
