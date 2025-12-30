import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';

export class ListCertificadosPorCoordenadorUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(coordenadorId: string): Promise<Certificate[]> {
    return this.certificateRepository.listByCoordenador(coordenadorId);
  }
}
