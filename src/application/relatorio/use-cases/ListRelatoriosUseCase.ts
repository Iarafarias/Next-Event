import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';
import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';

export class ListRelatoriosUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(): Promise<RelatorioResponseDTO[]> {
    return this.relatorioRepository.findAll();
  }
}
