import { UpdateRelatorioAvaliacaoDTO } from '../dtos/UpdateRelatorioAvaliacaoDTO';
import { RelatorioAvaliacaoResponseDTO } from '../dtos/RelatorioAvaliacaoResponseDTO';
import { IRelatorioAvaliacaoRepository } from '../../../domain/relatorioAvaliacao/repositories/IRelatorioAvaliacaoRepository';

export class UpdateRelatorioAvaliacaoUseCase {
  constructor(private relatorioAvaliacaoRepository: IRelatorioAvaliacaoRepository) {}

  async execute(id: string, data: UpdateRelatorioAvaliacaoDTO): Promise<RelatorioAvaliacaoResponseDTO | null> {
    return this.relatorioAvaliacaoRepository.update(id, data);
  }
}
