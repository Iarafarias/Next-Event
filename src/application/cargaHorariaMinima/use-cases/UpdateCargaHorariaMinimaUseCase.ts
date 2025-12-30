import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';
import { UpdateCargaHorariaMinimaDTO } from '../dtos/UpdateCargaHorariaMinimaDTO';
import { CargaHorariaMinimaResponseDTO } from '../dtos/CargaHorariaMinimaResponseDTO';

export class UpdateCargaHorariaMinimaUseCase {
  constructor(private cargaHorariaMinimaRepository: ICargaHorariaMinimaRepository) {}

  async execute(id: string, data: UpdateCargaHorariaMinimaDTO): Promise<CargaHorariaMinimaResponseDTO | null> {
    return this.cargaHorariaMinimaRepository.update(id, data);
  }
}
