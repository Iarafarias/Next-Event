import { CertificateRequest } from '../entities/CertificateRequest';

export interface ICertificateRequestRepository {
  create(request: CertificateRequest): Promise<CertificateRequest>;
  findById(id: string): Promise<CertificateRequest | null>;
  findActive(): Promise<CertificateRequest | null>;
  update(request: CertificateRequest): Promise<CertificateRequest>;
  findByMonthAndYear(month: number, year: number): Promise<CertificateRequest[]>;
} 