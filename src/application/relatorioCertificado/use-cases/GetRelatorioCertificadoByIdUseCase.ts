import { RelatorioCertificadoResponseDTO } from '../dtos/RelatorioCertificadoResponseDTO';
import { IRelatorioCertificadoRepository } from '../../../domain/relatorioCertificado/repositories/IRelatorioCertificadoRepository';

export class GetRelatorioCertificadoByIdUseCase {
  constructor(private relatorioCertificadoRepository: IRelatorioCertificadoRepository) {}

  async execute(id: string): Promise<RelatorioCertificadoResponseDTO | null> {
    return this.relatorioCertificadoRepository.getById(id);
  }
}
