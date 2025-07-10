import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

interface UpdateCertificateStatusRequest {
  id: string;
  status: 'approved' | 'rejected';
  adminComments?: string;
}

export class UpdateCertificateStatusUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute({ id, status, adminComments }: UpdateCertificateStatusRequest): Promise<Certificate> {
    const certificate = await this.certificateRepository.findById(id);
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }

    const updatedCertificate: Certificate = {
      ...certificate,
      status,
      adminComments,
      updatedAt: new Date(),
    };

    return this.certificateRepository.update(updatedCertificate);
  }
} 