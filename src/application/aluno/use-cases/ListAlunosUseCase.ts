import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { AlunoResponseDTO } from '../dtos/AlunoDTO';

export class ListAlunosUseCase {
  constructor(private alunoRepository: IAlunoRepository) {}

  async execute(): Promise<AlunoResponseDTO[]> {
    const alunos = await this.alunoRepository.findAll();
    
    return alunos.map(aluno => ({
      id: aluno.id,
      usuarioId: aluno.usuarioId,
      cursoId: aluno.cursoId,
      matricula: aluno.matricula,
      tipoAcesso: aluno.tipoAcesso,
      anoIngresso: aluno.anoIngresso,
      semestre: aluno.semestre,
      ativo: aluno.ativo || true,
      criadoEm: aluno.criadoEm || new Date(),
      atualizadoEm: aluno.atualizadoEm || new Date()
    }));
  }
}