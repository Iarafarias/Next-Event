import { RelatorioAcompanhamentoResponseDTO } from '../dtos/RelatorioAcompanhamentoResponseDTO';
import { IRelatorioAcompanhamentoRepository } from '../../../domain/relatorioAcompanhamento/repositories/IRelatorioAcompanhamentoRepository';

export class ListRelatorioAcompanhamentosUseCase {
  constructor(private relatorioAcompanhamentoRepository: IRelatorioAcompanhamentoRepository) {}

  async execute(): Promise<RelatorioAcompanhamentoResponseDTO[]> {
    return this.relatorioAcompanhamentoRepository.list();
  }
}
