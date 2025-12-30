import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';

export class ListCertificadosPorBolsistaUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(bolsistaId: string): Promise<Certificate[]> {
    return this.certificateRepository.listByBolsista(bolsistaId);
  }
}
