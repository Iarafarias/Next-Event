import { IRelatorioAlunoRepository } from '../../../domain/relatorioAluno/repositories/IRelatorioAlunoRepository';

export class DeleteRelatorioAlunoUseCase {
  constructor(private relatorioAlunoRepository: IRelatorioAlunoRepository) {}

  async execute(id: string): Promise<void> {
    await this.relatorioAlunoRepository.delete(id);
  }
}
