import { CreateRelatorioAvaliacaoDTO } from '../../../application/relatorioAvaliacao/dtos/CreateRelatorioAvaliacaoDTO';
import { UpdateRelatorioAvaliacaoDTO } from '../../../application/relatorioAvaliacao/dtos/UpdateRelatorioAvaliacaoDTO';
import { RelatorioAvaliacaoResponseDTO } from '../../../application/relatorioAvaliacao/dtos/RelatorioAvaliacaoResponseDTO';

export interface IRelatorioAvaliacaoRepository {
  create(data: CreateRelatorioAvaliacaoDTO): Promise<RelatorioAvaliacaoResponseDTO>;
  update(id: string, data: UpdateRelatorioAvaliacaoDTO): Promise<RelatorioAvaliacaoResponseDTO | null>;
  getById(id: string): Promise<RelatorioAvaliacaoResponseDTO | null>;
  list(): Promise<RelatorioAvaliacaoResponseDTO[]>;
  delete(id: string): Promise<void>;
}
