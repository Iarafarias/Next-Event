import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { UpdateCursoDTO } from '../dtos/UpdateCursoDTO';
import { CursoResponseDTO } from '../dtos/CursoResponseDTO';

export class UpdateCursoUseCase {
    constructor(private cursoRepository: ICursoRepository) { }

    async execute(data: UpdateCursoDTO): Promise<CursoResponseDTO> {
        // Verificar se curso existe
        const cursoExists = await this.cursoRepository.findById(data.id);
        if (!cursoExists) throw new Error('Curso não encontrado');

        // Se está alterando o código, verificar se não existe outro curso com esse código
        if (data.codigo && data.codigo !== cursoExists.codigo) {
            const cursoComCodigo = await this.cursoRepository.findByCodigo(data.codigo);
            if (cursoComCodigo) throw new Error('Já existe um curso com este código');
        }

        const updated = await this.cursoRepository.update(data);
        if (!updated) throw new Error('Erro ao atualizar curso');

        return updated;
    }
}
