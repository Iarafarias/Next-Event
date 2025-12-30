import { RelatorioAvaliacaoResponseDTO } from '../dtos/RelatorioAvaliacaoResponseDTO';
import { IRelatorioAvaliacaoRepository } from '../../../domain/relatorioAvaliacao/repositories/IRelatorioAvaliacaoRepository';

export class GetRelatorioAvaliacaoByIdUseCase {
  constructor(private relatorioAvaliacaoRepository: IRelatorioAvaliacaoRepository) {}

  async execute(id: string): Promise<RelatorioAvaliacaoResponseDTO | null> {
    return this.relatorioAvaliacaoRepository.getById(id);
  }
}
