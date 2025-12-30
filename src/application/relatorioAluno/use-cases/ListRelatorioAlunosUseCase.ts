import { RelatorioAlunoResponseDTO } from '../dtos/RelatorioAlunoResponseDTO';
import { IRelatorioAlunoRepository } from '../../../domain/relatorioAluno/repositories/IRelatorioAlunoRepository';

export class ListRelatorioAlunosUseCase {
  constructor(private relatorioAlunoRepository: IRelatorioAlunoRepository) {}

  async execute(): Promise<RelatorioAlunoResponseDTO[]> {
    return this.relatorioAlunoRepository.list();
  }
}
