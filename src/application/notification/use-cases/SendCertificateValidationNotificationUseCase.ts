import { CreateNotificationUseCase } from './CreateNotificationUseCase';
import { NotificationType } from '../../../domain/notification/entities/Notification';

export interface CertificateValidationNotificationData {
  userId: string;
  certificateId: string;
  certificateName: string;
  isApproved: boolean;
  adminMessage?: string;
}

export class SendCertificateValidationNotificationUseCase {
  constructor(
    private createNotificationUseCase: CreateNotificationUseCase
  ) {}

  async execute(data: CertificateValidationNotificationData): Promise<void> {
    const { userId, certificateId, certificateName, isApproved, adminMessage } = data;

    const notificationType = isApproved 
      ? 'certificate_approved' as NotificationType
      : 'certificate_rejected' as NotificationType;

    const title = isApproved 
      ? '✅ Certificado Aprovado'
      : '❌ Certificado Rejeitado';

    let message = isApproved
      ? `Seu certificado "${certificateName}" foi aprovado e validado com sucesso!`
      : `Seu certificado "${certificateName}" foi rejeitado.`;

    if (adminMessage) {
      message += ` Observação do administrador: ${adminMessage}`;
    }

    await this.createNotificationUseCase.execute({
      userId,
      type: notificationType,
      title,
      message,
      relatedEntityId: certificateId,
      relatedEntityType: 'certificate',
    });
  }
}
