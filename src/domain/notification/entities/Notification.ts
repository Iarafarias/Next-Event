import crypto from 'node:crypto';
export type NotificationType = 'certificate_approved' | 'certificate_rejected' | 'certificate_pending' | 'system_announcement';
export type NotificationStatus = 'unread' | 'read';

interface NotificationProps {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export class Notification {
  id!: string;
  userId!: string;
  type!: NotificationType;
  title!: string;
  message!: string;
  status!: NotificationStatus;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt!: Date;
  readAt?: Date;

  constructor(props: NotificationProps) {
    Object.assign(this, {
      ...props,
      id: crypto.randomUUID(),
      status: 'unread' as NotificationStatus,
      createdAt: new Date(),
    });
  }

  markAsRead(): void {
    this.status = 'read';
    this.readAt = new Date();
  }

  isExpired(expirationDays: number = 30): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > expirationDays;
  }
}
