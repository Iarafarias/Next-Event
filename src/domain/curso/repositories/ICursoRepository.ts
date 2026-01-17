import { CursoResponseDTO } from '../../../application/curso/dtos/CursoResponseDTO';
import { CreateCursoDTO } from '../../../application/curso/dtos/CreateCursoDTO';
import { UpdateCursoDTO } from '../../../application/curso/dtos/UpdateCursoDTO';

export interface ICursoRepository {
    create(data: CreateCursoDTO): Promise<CursoResponseDTO>;
    findAll(): Promise<CursoResponseDTO[]>;
    findById(id: string): Promise<CursoResponseDTO | null>;
    findByCodigo(codigo: string): Promise<CursoResponseDTO | null>;
    update(data: UpdateCursoDTO): Promise<CursoResponseDTO | null>;
    delete(id: string): Promise<void>;
}
