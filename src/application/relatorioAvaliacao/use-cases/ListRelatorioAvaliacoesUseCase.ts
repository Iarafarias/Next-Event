import { RelatorioAvaliacaoResponseDTO } from '../dtos/RelatorioAvaliacaoResponseDTO';
import { IRelatorioAvaliacaoRepository } from '../../../domain/relatorioAvaliacao/repositories/IRelatorioAvaliacaoRepository';

export class ListRelatorioAvaliacoesUseCase {
  constructor(private relatorioAvaliacaoRepository: IRelatorioAvaliacaoRepository) {}

  async execute(): Promise<RelatorioAvaliacaoResponseDTO[]> {
    return this.relatorioAvaliacaoRepository.list();
  }
}
