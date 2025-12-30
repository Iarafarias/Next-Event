import { IRelatorioCertificadoRepository } from '../../../domain/relatorioCertificado/repositories/IRelatorioCertificadoRepository';

export class DeleteRelatorioCertificadoUseCase {
  constructor(private relatorioCertificadoRepository: IRelatorioCertificadoRepository) {}

  async execute(id: string): Promise<void> {
    await this.relatorioCertificadoRepository.delete(id);
  }
}
