import { CreateCargaHorariaMinimaDTO } from '../../../application/cargaHorariaMinima/dtos/CreateCargaHorariaMinimaDTO';
import { UpdateCargaHorariaMinimaDTO } from '../../../application/cargaHorariaMinima/dtos/UpdateCargaHorariaMinimaDTO';
import { CargaHorariaMinimaResponseDTO } from '../../../application/cargaHorariaMinima/dtos/CargaHorariaMinimaResponseDTO';

export interface ICargaHorariaMinimaRepository {
  create(data: CreateCargaHorariaMinimaDTO): Promise<CargaHorariaMinimaResponseDTO>;
  update(id: string, data: UpdateCargaHorariaMinimaDTO): Promise<CargaHorariaMinimaResponseDTO | null>;
  getById(id: string): Promise<CargaHorariaMinimaResponseDTO | null>;
  list(periodoId?: string): Promise<CargaHorariaMinimaResponseDTO[]>;
  delete(id: string): Promise<void>;
}

