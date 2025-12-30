import { UpdateRelatorioAcompanhamentoDTO } from '../dtos/UpdateRelatorioAcompanhamentoDTO';
import { RelatorioAcompanhamentoResponseDTO } from '../dtos/RelatorioAcompanhamentoResponseDTO';
import { IRelatorioAcompanhamentoRepository } from '../../../domain/relatorioAcompanhamento/repositories/IRelatorioAcompanhamentoRepository';

export class UpdateRelatorioAcompanhamentoUseCase {
  constructor(private relatorioAcompanhamentoRepository: IRelatorioAcompanhamentoRepository) {}

  async execute(id: string, data: UpdateRelatorioAcompanhamentoDTO): Promise<RelatorioAcompanhamentoResponseDTO | null> {
    return this.relatorioAcompanhamentoRepository.update(id, data);
  }
}
