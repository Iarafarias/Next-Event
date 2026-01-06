import { CertificateRequest } from '../../../domain/certificate/entities/CertificateRequest';
import { ICertificateRequestRepository } from '../../../domain/certificate/repositories/ICertificateRequestRepository';
import { CreateCertificateRequestDTO } from '../dtos/CreateCertificateRequestDTO';
import { randomUUID } from 'crypto';

export class CreateCertificateRequestUseCase {
  constructor(private certificateRequestRepository: ICertificateRequestRepository) {}

  async execute(data: CreateCertificateRequestDTO): Promise<CertificateRequest> {
    const request: CertificateRequest = {
      id: randomUUID(),
      ...data,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.certificateRequestRepository.create(request);
  }
} 