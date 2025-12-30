import { CreateRelatorioAlunoDTO } from '../../../application/relatorioAluno/dtos/CreateRelatorioAlunoDTO';
import { UpdateRelatorioAlunoDTO } from '../../../application/relatorioAluno/dtos/UpdateRelatorioAlunoDTO';
import { RelatorioAlunoResponseDTO } from '../../../application/relatorioAluno/dtos/RelatorioAlunoResponseDTO';

export interface IRelatorioAlunoRepository {
  create(data: CreateRelatorioAlunoDTO): Promise<RelatorioAlunoResponseDTO>;
  update(id: string, data: UpdateRelatorioAlunoDTO): Promise<RelatorioAlunoResponseDTO | null>;
  getById(id: string): Promise<RelatorioAlunoResponseDTO | null>;
  list(): Promise<RelatorioAlunoResponseDTO[]>;
  delete(id: string): Promise<void>;
}
