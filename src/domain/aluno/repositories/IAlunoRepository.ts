import { AlunoResponseDTO } from '../../../application/aluno/dtos/AlunoResponseDTO';
import { UpdateAlunoDTO } from '../../../application/aluno/dtos/UpdateAlunoDTO';

export interface IAlunoRepository {
    findAll(filters?: { cursoId?: string; role?: string }): Promise<AlunoResponseDTO[]>;
    findById(id: string): Promise<AlunoResponseDTO | null>;
    findByUsuarioId(usuarioId: string): Promise<AlunoResponseDTO | null>;
    update(data: UpdateAlunoDTO): Promise<AlunoResponseDTO | null>;
}
