import { FormAcompanhamentoResponseDTO } from '../dtos/FormAcompanhamentoResponseDTO';
import { IFormAcompanhamentoRepository, FormAcompanhamentoFilters } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class ListFormAcompanhamentosUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) { }

  async execute(filters?: FormAcompanhamentoFilters): Promise<FormAcompanhamentoResponseDTO[]> {
    return this.formAcompanhamentoRepository.list(filters);
  }
}
