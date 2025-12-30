import { CreateRelatorioAcompanhamentoDTO } from '../dtos/CreateRelatorioAcompanhamentoDTO';
import { RelatorioAcompanhamentoResponseDTO } from '../dtos/RelatorioAcompanhamentoResponseDTO';
import { IRelatorioAcompanhamentoRepository } from '../../../domain/relatorioAcompanhamento/repositories/IRelatorioAcompanhamentoRepository';

export class CreateRelatorioAcompanhamentoUseCase {
  constructor(private relatorioAcompanhamentoRepository: IRelatorioAcompanhamentoRepository) {}

  async execute(data: CreateRelatorioAcompanhamentoDTO): Promise<RelatorioAcompanhamentoResponseDTO> {
    return this.relatorioAcompanhamentoRepository.create(data);
  }
}
