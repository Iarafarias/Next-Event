import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { SendCertificateValidationNotificationUseCase } from '../../notification/use-cases/SendCertificateValidationNotificationUseCase';

interface UpdateCertificateStatusRequest {
  id: string;
  status: 'approved' | 'rejected';
  adminComments?: string;
}

export class UpdateCertificateStatusUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private sendNotificationUseCase: SendCertificateValidationNotificationUseCase
  ) { }

  async execute({ id, status, adminComments }: UpdateCertificateStatusRequest): Promise<Certificate> {
    const certificate = await this.certificateRepository.findById(id);

    if (!certificate) {
      throw new Error('Certificado não encontrado');
    }

    if (status === 'approved') {
      certificate.approve();
    } else {
      certificate.reject(adminComments || 'Nenhuma justificativa fornecida');
    }

    certificate.adminComments = adminComments;
    certificate.updatedAt = new Date();

    const updatedCertificate = await this.certificateRepository.update(certificate);

    try {
      await this.sendNotificationUseCase.execute({
        userId: certificate.userId,
        certificateId: certificate.id,
        certificateName: certificate.fileName,
        isApproved: status === 'approved',
        adminMessage: adminComments,
      });
    } catch (error) {
    }

    return updatedCertificate;
  }
} 