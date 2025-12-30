import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class DeleteAlocarTutorAlunoUseCase {
  constructor(private alocarTutorAlunoRepository: IAlocarTutorAlunoRepository) {}

  async execute(id: string): Promise<void> {
    await this.alocarTutorAlunoRepository.delete(id);
  }
}
