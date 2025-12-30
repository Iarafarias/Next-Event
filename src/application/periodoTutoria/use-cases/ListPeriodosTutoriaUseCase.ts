import { PeriodoTutoriaResponseDTO } from '../dtos/PeriodoTutoriaResponseDTO';
import { IPeriodoTutoriaRepository } from '../../../domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';

export class ListPeriodosTutoriaUseCase {
  constructor(private periodoTutoriaRepository: IPeriodoTutoriaRepository) {}

  async execute(): Promise<PeriodoTutoriaResponseDTO[]> {
    return this.periodoTutoriaRepository.list();
  }
}
