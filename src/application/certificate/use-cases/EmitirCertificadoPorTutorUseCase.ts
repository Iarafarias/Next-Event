import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';

export class EmitirCertificadoPorTutorUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(tutorId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
    // Cria certificado vinculado ao tutor
    return this.certificateRepository.emitirPorTutor(tutorId, dados);
  }
}
