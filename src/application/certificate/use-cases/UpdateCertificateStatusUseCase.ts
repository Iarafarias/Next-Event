import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { SendCertificateValidationNotificationUseCase } from '../../notification/use-cases/SendCertificateValidationNotificationUseCase';

interface UpdateCertificateStatusRequest {
  id: string;
  status: 'approved' | 'rejected' | 'pending';
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
      throw new Error('Certificate not found');
    }

    if (status === 'approved') {
      certificate.approve();
    } else if (status === 'rejected') {
      certificate.reject(adminComments || 'No comments provided');
    } else if (status === 'pending') {
      certificate.pending();
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