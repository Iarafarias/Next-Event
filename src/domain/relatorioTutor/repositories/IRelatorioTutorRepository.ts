import { CreateRelatorioTutorDTO } from '../../../application/relatorioTutor/dtos/CreateRelatorioTutorDTO';
import { UpdateRelatorioTutorDTO } from '../../../application/relatorioTutor/dtos/UpdateRelatorioTutorDTO';
import { RelatorioTutorResponseDTO } from '../../../application/relatorioTutor/dtos/RelatorioTutorResponseDTO';

export interface IRelatorioTutorRepository {
  create(data: CreateRelatorioTutorDTO): Promise<RelatorioTutorResponseDTO>;
  update(id: string, data: UpdateRelatorioTutorDTO): Promise<RelatorioTutorResponseDTO | null>;
  getById(id: string): Promise<RelatorioTutorResponseDTO | null>;
  list(): Promise<RelatorioTutorResponseDTO[]>;
  delete(id: string): Promise<void>;
}
