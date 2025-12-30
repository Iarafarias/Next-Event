import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';

export class ListCertificadosPorTutorUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(tutorId: string): Promise<Certificate[]> {
    return this.certificateRepository.listByTutor(tutorId);
  }
}
