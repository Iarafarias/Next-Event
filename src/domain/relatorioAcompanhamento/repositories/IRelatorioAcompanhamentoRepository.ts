import { CreateRelatorioAcompanhamentoDTO } from '../../../application/relatorioAcompanhamento/dtos/CreateRelatorioAcompanhamentoDTO';
import { UpdateRelatorioAcompanhamentoDTO } from '../../../application/relatorioAcompanhamento/dtos/UpdateRelatorioAcompanhamentoDTO';
import { RelatorioAcompanhamentoResponseDTO } from '../../../application/relatorioAcompanhamento/dtos/RelatorioAcompanhamentoResponseDTO';

export interface IRelatorioAcompanhamentoRepository {
  create(data: CreateRelatorioAcompanhamentoDTO): Promise<RelatorioAcompanhamentoResponseDTO>;
  update(id: string, data: UpdateRelatorioAcompanhamentoDTO): Promise<RelatorioAcompanhamentoResponseDTO | null>;
  getById(id: string): Promise<RelatorioAcompanhamentoResponseDTO | null>;
  list(): Promise<RelatorioAcompanhamentoResponseDTO[]>;
  delete(id: string): Promise<void>;
}
