import { PeriodoTutoriaResponseDTO } from '../dtos/PeriodoTutoriaResponseDTO';
import { IPeriodoTutoriaRepository } from '../../../domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';

export class GetPeriodoTutoriaByIdUseCase {
  constructor(private periodoTutoriaRepository: IPeriodoTutoriaRepository) {}

  async execute(id: string): Promise<PeriodoTutoriaResponseDTO | null> {
    return this.periodoTutoriaRepository.getById(id);
  }
}
