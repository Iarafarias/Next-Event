import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

interface UserCertificateReport {
  userId: string;
  totalCertificates: number;
  totalWorkload: number;
  approvedCertificates: number;
  pendingCertificates: number;
  rejectedCertificates: number;
  certificates: Certificate[];
}

export class GenerateUserReportUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(userId: string): Promise<UserCertificateReport> {
    const certificates = await this.certificateRepository.findByUserId(userId);
    
    const report: UserCertificateReport = {
      userId,
      totalCertificates: certificates.length,
      totalWorkload: certificates.reduce((total, cert) => total + cert.workload, 0),
      approvedCertificates: certificates.filter(cert => cert.status === 'approved').length,
      pendingCertificates: certificates.filter(cert => cert.status === 'pending').length,
      rejectedCertificates: certificates.filter(cert => cert.status === 'rejected').length,
      certificates,
    };

    return report;
  }
} 