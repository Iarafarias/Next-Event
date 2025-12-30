import { IRelatorioAcompanhamentoRepository } from '../../../domain/relatorioAcompanhamento/repositories/IRelatorioAcompanhamentoRepository';

export class DeleteRelatorioAcompanhamentoUseCase {
  constructor(private relatorioAcompanhamentoRepository: IRelatorioAcompanhamentoRepository) {}

  async execute(id: string): Promise<void> {
    await this.relatorioAcompanhamentoRepository.delete(id);
  }
}
