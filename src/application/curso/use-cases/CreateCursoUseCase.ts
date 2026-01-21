import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { Curso } from '../../../domain/curso/entities/Curso';
import { CreateCursoDTO } from '../dtos/CursoDTO';

export class CreateCursoUseCase {
  constructor(private cursoRepository: ICursoRepository) {}

  async execute(data: CreateCursoDTO): Promise<void> {
    // Verificar se código já existe
    const cursoExistente = await this.cursoRepository.findByCodigo(data.codigo);
    if (cursoExistente) {
      throw new Error('Código do curso já cadastrado');
    }

    // Criar curso
    const curso = Curso.create({
      nome: data.nome,
      codigo: data.codigo,
      descricao: data.descricao,
      ativo: data.ativo
    });

    await this.cursoRepository.save(curso);
  }
}