import { CreateRelatorioCertificadoDTO } from '../dtos/CreateRelatorioCertificadoDTO';
import { RelatorioCertificadoResponseDTO } from '../dtos/RelatorioCertificadoResponseDTO';
import { IRelatorioCertificadoRepository } from '../../../domain/relatorioCertificado/repositories/IRelatorioCertificadoRepository';

export class CreateRelatorioCertificadoUseCase {
  constructor(private relatorioCertificadoRepository: IRelatorioCertificadoRepository) {}

  async execute(data: CreateRelatorioCertificadoDTO): Promise<RelatorioCertificadoResponseDTO> {
    return this.relatorioCertificadoRepository.create(data);
  }
}
