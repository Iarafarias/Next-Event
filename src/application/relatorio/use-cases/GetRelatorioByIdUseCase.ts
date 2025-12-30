import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';
import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';

export class GetRelatorioByIdUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(id: string): Promise<RelatorioResponseDTO | null> {
    return this.relatorioRepository.findById(id);
  }
}
