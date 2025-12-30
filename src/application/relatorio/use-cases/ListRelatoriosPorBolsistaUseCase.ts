import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';
import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';

export class ListRelatoriosPorBolsistaUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(bolsistaId: string): Promise<RelatorioResponseDTO[]> {
    return this.relatorioRepository.listByBolsista(bolsistaId);
  }
}
