import { CreateRelatorioAlunoDTO } from '../dtos/CreateRelatorioAlunoDTO';
import { RelatorioAlunoResponseDTO } from '../dtos/RelatorioAlunoResponseDTO';
import { IRelatorioAlunoRepository } from '../../../domain/relatorioAluno/repositories/IRelatorioAlunoRepository';

export class CreateRelatorioAlunoUseCase {
  constructor(private relatorioAlunoRepository: IRelatorioAlunoRepository) {}

  async execute(data: CreateRelatorioAlunoDTO): Promise<RelatorioAlunoResponseDTO> {
    return this.relatorioAlunoRepository.create(data);
  }
}
