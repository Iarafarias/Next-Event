import { CreateRelatorioCertificadoDTO } from '../../../application/relatorioCertificado/dtos/CreateRelatorioCertificadoDTO';
import { UpdateRelatorioCertificadoDTO } from '../../../application/relatorioCertificado/dtos/UpdateRelatorioCertificadoDTO';
import { RelatorioCertificadoResponseDTO } from '../../../application/relatorioCertificado/dtos/RelatorioCertificadoResponseDTO';

export interface IRelatorioCertificadoRepository {
  create(data: CreateRelatorioCertificadoDTO): Promise<RelatorioCertificadoResponseDTO>;
  update(id: string, data: UpdateRelatorioCertificadoDTO): Promise<RelatorioCertificadoResponseDTO | null>;
  getById(id: string): Promise<RelatorioCertificadoResponseDTO | null>;
  list(): Promise<RelatorioCertificadoResponseDTO[]>;
  delete(id: string): Promise<void>;
}
