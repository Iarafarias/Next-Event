import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';

export class SolicitarCertificadoPorBolsistaUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(bolsistaId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
    // Cria solicitação de certificado para o bolsista
    return this.certificateRepository.solicitarPorBolsista(bolsistaId, dados);
  }
}
