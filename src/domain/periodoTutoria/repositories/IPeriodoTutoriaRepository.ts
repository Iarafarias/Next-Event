import { CreatePeriodoTutoriaDTO } from '../../../application/periodoTutoria/dtos/CreatePeriodoTutoriaDTO';
import { UpdatePeriodoTutoriaDTO } from '../../../application/periodoTutoria/dtos/UpdatePeriodoTutoriaDTO';
import { PeriodoTutoriaResponseDTO } from '../../../application/periodoTutoria/dtos/PeriodoTutoriaResponseDTO';

export interface IPeriodoTutoriaRepository {
  create(data: CreatePeriodoTutoriaDTO): Promise<PeriodoTutoriaResponseDTO>;
  update(id: string, data: UpdatePeriodoTutoriaDTO): Promise<PeriodoTutoriaResponseDTO | null>;
  getById(id: string): Promise<PeriodoTutoriaResponseDTO | null>;
  list(): Promise<PeriodoTutoriaResponseDTO[]>;
  delete(id: string): Promise<void>;
}
