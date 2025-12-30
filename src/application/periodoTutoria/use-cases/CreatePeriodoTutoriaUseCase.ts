import { CreatePeriodoTutoriaDTO } from '../dtos/CreatePeriodoTutoriaDTO';
import { PeriodoTutoriaResponseDTO } from '../dtos/PeriodoTutoriaResponseDTO';
import { IPeriodoTutoriaRepository } from '../../../domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';

export class CreatePeriodoTutoriaUseCase {
  constructor(private periodoTutoriaRepository: IPeriodoTutoriaRepository) {}

  async execute(data: CreatePeriodoTutoriaDTO): Promise<PeriodoTutoriaResponseDTO> {
    return this.periodoTutoriaRepository.create(data);
  }
}
