import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

interface ListUserCertificatesRequest {
  userId: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export class ListUserCertificatesUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute({ userId, status }: ListUserCertificatesRequest): Promise<Certificate[]> {
    let certificates: Certificate[];
    
    if (status) {
      certificates = await this.certificateRepository.findByUserIdAndStatus(userId, status);
    } else {
      certificates = await this.certificateRepository.findByUserId(userId);
    }

    return certificates;
  }
} 