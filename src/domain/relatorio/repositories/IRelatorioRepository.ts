import { CreateRelatorioDTO } from '../../../application/relatorio/dtos/CreateRelatorioDTO';
import { UpdateRelatorioDTO } from '../../../application/relatorio/dtos/UpdateRelatorioDTO';
import { RelatorioResponseDTO } from '../../../application/relatorio/dtos/RelatorioResponseDTO';

export interface IRelatorioRepository {
  create(data: CreateRelatorioDTO): Promise<RelatorioResponseDTO>;
  update(data: UpdateRelatorioDTO): Promise<RelatorioResponseDTO>;
  findById(id: string): Promise<RelatorioResponseDTO | null>;
  findAll(): Promise<RelatorioResponseDTO[]>;
  delete(id: string): Promise<void>;

  listByCoordenador(coordenadorId: string): Promise<RelatorioResponseDTO[]>;
  listByTutor(tutorId: string): Promise<RelatorioResponseDTO[]>;
  listByBolsista(bolsistaId: string): Promise<RelatorioResponseDTO[]>;
}
