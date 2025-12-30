import { CreateFormAcompanhamentoDTO } from '../dtos/CreateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../dtos/FormAcompanhamentoResponseDTO';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class CreateFormAcompanhamentoUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) {}

  async execute(data: CreateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO> {
    return this.formAcompanhamentoRepository.create(data);
  }
}
