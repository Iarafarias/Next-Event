import { UpdateRelatorioAlunoDTO } from '../dtos/UpdateRelatorioAlunoDTO';
import { RelatorioAlunoResponseDTO } from '../dtos/RelatorioAlunoResponseDTO';
import { IRelatorioAlunoRepository } from '../../../domain/relatorioAluno/repositories/IRelatorioAlunoRepository';

export class UpdateRelatorioAlunoUseCase {
  constructor(private relatorioAlunoRepository: IRelatorioAlunoRepository) {}

  async execute(id: string, data: UpdateRelatorioAlunoDTO): Promise<RelatorioAlunoResponseDTO | null> {
    return this.relatorioAlunoRepository.update(id, data);
  }
}
