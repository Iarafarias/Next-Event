import { CreateRelatorioAvaliacaoDTO } from '../dtos/CreateRelatorioAvaliacaoDTO';
import { RelatorioAvaliacaoResponseDTO } from '../dtos/RelatorioAvaliacaoResponseDTO';
import { IRelatorioAvaliacaoRepository } from '../../../domain/relatorioAvaliacao/repositories/IRelatorioAvaliacaoRepository';

export class CreateRelatorioAvaliacaoUseCase {
  constructor(private relatorioAvaliacaoRepository: IRelatorioAvaliacaoRepository) {}

  async execute(data: CreateRelatorioAvaliacaoDTO): Promise<RelatorioAvaliacaoResponseDTO> {
    return this.relatorioAvaliacaoRepository.create(data);
  }
}
