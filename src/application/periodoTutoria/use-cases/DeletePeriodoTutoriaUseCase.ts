import { IPeriodoTutoriaRepository } from '../../../domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';

export class DeletePeriodoTutoriaUseCase {
  constructor(private periodoTutoriaRepository: IPeriodoTutoriaRepository) {}

  async execute(id: string): Promise<void> {
    await this.periodoTutoriaRepository.delete(id);
  }
}
