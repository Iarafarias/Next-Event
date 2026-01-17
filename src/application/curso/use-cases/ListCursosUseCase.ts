import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { CursoResponseDTO } from '../dtos/CursoResponseDTO';

export class ListCursosUseCase {
    constructor(private cursoRepository: ICursoRepository) { }

    async execute(): Promise<CursoResponseDTO[]> {
        return await this.cursoRepository.findAll();
    }
}
