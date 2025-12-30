import { RelatorioAcompanhamentoResponseDTO } from '../dtos/RelatorioAcompanhamentoResponseDTO';
import { IRelatorioAcompanhamentoRepository } from '../../../domain/relatorioAcompanhamento/repositories/IRelatorioAcompanhamentoRepository';

export class GetRelatorioAcompanhamentoByIdUseCase {
  constructor(private relatorioAcompanhamentoRepository: IRelatorioAcompanhamentoRepository) {}

  async execute(id: string): Promise<RelatorioAcompanhamentoResponseDTO | null> {
    return this.relatorioAcompanhamentoRepository.getById(id);
  }
}
