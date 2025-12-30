import { IRelatorioTutorRepository } from '../../../domain/relatorioTutor/repositories/IRelatorioTutorRepository';

export class DeleteRelatorioTutorUseCase {
  constructor(private relatorioTutorRepository: IRelatorioTutorRepository) {}

  async execute(id: string): Promise<void> {
    await this.relatorioTutorRepository.delete(id);
  }
}
