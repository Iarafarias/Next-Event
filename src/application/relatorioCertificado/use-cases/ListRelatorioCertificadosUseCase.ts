import { RelatorioCertificadoResponseDTO } from '../dtos/RelatorioCertificadoResponseDTO';
import { IRelatorioCertificadoRepository } from '../../../domain/relatorioCertificado/repositories/IRelatorioCertificadoRepository';

export class ListRelatorioCertificadosUseCase {
  constructor(private relatorioCertificadoRepository: IRelatorioCertificadoRepository) {}

  async execute(): Promise<RelatorioCertificadoResponseDTO[]> {
    return this.relatorioCertificadoRepository.list();
  }
}
