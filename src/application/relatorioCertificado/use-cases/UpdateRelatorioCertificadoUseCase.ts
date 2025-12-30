import { UpdateRelatorioCertificadoDTO } from '../dtos/UpdateRelatorioCertificadoDTO';
import { RelatorioCertificadoResponseDTO } from '../dtos/RelatorioCertificadoResponseDTO';
import { IRelatorioCertificadoRepository } from '../../../domain/relatorioCertificado/repositories/IRelatorioCertificadoRepository';

export class UpdateRelatorioCertificadoUseCase {
  constructor(private relatorioCertificadoRepository: IRelatorioCertificadoRepository) {}

  async execute(id: string, data: UpdateRelatorioCertificadoDTO): Promise<RelatorioCertificadoResponseDTO | null> {
    return this.relatorioCertificadoRepository.update(id, data);
  }
}
