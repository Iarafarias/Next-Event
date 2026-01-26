import { CreateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/CreateFormAcompanhamentoDTO';
import { UpdateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/UpdateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../../../application/formAcompanhamento/dtos/FormAcompanhamentoResponseDTO';

export interface FormAcompanhamentoFilters {
  tutorId?: string;
  bolsistaId?: string;
  periodoId?: string;
}

export const FORM_ACOMPANHAMENTO_REPOSITORY = 'IFormAcompanhamentoRepository';

export interface IFormAcompanhamentoRepository {
  create(data: CreateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO>;
  update(id: string, data: UpdateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO | null>;
  getById(id: string): Promise<FormAcompanhamentoResponseDTO | null>;
  list(filters?: FormAcompanhamentoFilters): Promise<FormAcompanhamentoResponseDTO[]>;
  delete(id: string): Promise<void>;
}
