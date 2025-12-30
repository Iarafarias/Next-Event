import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';
import { CargaHorariaMinimaResponseDTO } from '../dtos/CargaHorariaMinimaResponseDTO';

export class GetCargaHorariaMinimaByIdUseCase {
  constructor(private cargaHorariaMinimaRepository: ICargaHorariaMinimaRepository) {}

  async execute(id: string): Promise<CargaHorariaMinimaResponseDTO | null> {
    return this.cargaHorariaMinimaRepository.getById(id);
  }
}
