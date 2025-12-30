import { UpdatePeriodoTutoriaDTO } from '../dtos/UpdatePeriodoTutoriaDTO';
import { PeriodoTutoriaResponseDTO } from '../dtos/PeriodoTutoriaResponseDTO';
import { IPeriodoTutoriaRepository } from '../../../domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';

export class UpdatePeriodoTutoriaUseCase {
  constructor(private periodoTutoriaRepository: IPeriodoTutoriaRepository) {}

  async execute(id: string, data: UpdatePeriodoTutoriaDTO): Promise<PeriodoTutoriaResponseDTO | null> {
    return this.periodoTutoriaRepository.update(id, data);
  }
}
