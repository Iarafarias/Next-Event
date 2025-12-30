import { IRelatorioAvaliacaoRepository } from '../../../domain/relatorioAvaliacao/repositories/IRelatorioAvaliacaoRepository';

export class DeleteRelatorioAvaliacaoUseCase {
  constructor(private relatorioAvaliacaoRepository: IRelatorioAvaliacaoRepository) {}

  async execute(id: string): Promise<void> {
    await this.relatorioAvaliacaoRepository.delete(id);
  }
}
