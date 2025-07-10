import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

interface ListUserCertificatesRequest {
  userId: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export class ListUserCertificatesUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute({ userId, status }: ListUserCertificatesRequest): Promise<Certificate[]> {
    if (status) {
      return this.certificateRepository.findByUserIdAndStatus(userId, status);
    }
    return this.certificateRepository.findByUserId(userId);
  }
} 