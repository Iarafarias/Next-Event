import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { CreateCursoDTO } from '../dtos/CreateCursoDTO';
import { CursoResponseDTO } from '../dtos/CursoResponseDTO';

export class CreateCursoUseCase {
    constructor(private cursoRepository: ICursoRepository) { }

    async execute(data: CreateCursoDTO): Promise<CursoResponseDTO> {
        if (!data.nome) throw new Error('Nome é obrigatório');
        if (!data.codigo) throw new Error('Código é obrigatório');

        // Verificar se já existe curso com esse código
        const cursoExists = await this.cursoRepository.findByCodigo(data.codigo);
        if (cursoExists) throw new Error('Já existe um curso com este código');

        return await this.cursoRepository.create(data);
    }
}
