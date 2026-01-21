import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { CursoResponseDTO } from '../dtos/CursoDTO';

export class ListCursosUseCase {
  constructor(private cursoRepository: ICursoRepository) {}

  async execute(): Promise<CursoResponseDTO[]> {
    const cursos = await this.cursoRepository.findAll();
    
    return cursos.map(curso => ({
      id: curso.id,
      nome: curso.nome,
      codigo: curso.codigo,
      descricao: curso.descricao,
      ativo: curso.ativo || true,
      criadoEm: curso.criadoEm || new Date(),
      atualizadoEm: curso.atualizadoEm || new Date()
    }));
  }
}