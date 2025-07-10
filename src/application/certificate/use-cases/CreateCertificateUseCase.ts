import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { CreateCertificateDTO } from '../dtos/CreateCertificateDTO';

export class CreateCertificateUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(data: CreateCertificateDTO): Promise<Certificate> {
    const certificate: Certificate = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.certificateRepository.create(certificate);
  }
} 