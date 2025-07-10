import { Certificate } from '../entities/Certificate';

export interface ICertificateRepository {
  create(certificate: Certificate): Promise<Certificate>;
  findById(id: string): Promise<Certificate | null>;
  findByUserId(userId: string): Promise<Certificate[]>;
  update(certificate: Certificate): Promise<Certificate>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Certificate[]>;
  findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]>;
  findByUserIdAndStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]>;
} 