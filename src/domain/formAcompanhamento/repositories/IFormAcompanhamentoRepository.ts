import { CreateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/CreateFormAcompanhamentoDTO';
import { UpdateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/UpdateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../../../application/formAcompanhamento/dtos/FormAcompanhamentoResponseDTO';

export interface IFormAcompanhamentoRepository {
  create(data: CreateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO>;
  update(id: string, data: UpdateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO | null>;
  getById(id: string): Promise<FormAcompanhamentoResponseDTO | null>;
  list(): Promise<FormAcompanhamentoResponseDTO[]>;
  delete(id: string): Promise<void>;
}
