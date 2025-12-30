import { RelatorioAlunoResponseDTO } from '../dtos/RelatorioAlunoResponseDTO';
import { IRelatorioAlunoRepository } from '../../../domain/relatorioAluno/repositories/IRelatorioAlunoRepository';

export class GetRelatorioAlunoByIdUseCase {
  constructor(private relatorioAlunoRepository: IRelatorioAlunoRepository) {}

  async execute(id: string): Promise<RelatorioAlunoResponseDTO | null> {
    return this.relatorioAlunoRepository.getById(id);
  }
}
