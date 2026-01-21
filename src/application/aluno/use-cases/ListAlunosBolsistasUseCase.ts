import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { TipoAcessoAluno } from '../../../domain/aluno/entities/Aluno';
import { AlunoResponseDTO } from '../dtos/AlunoDTO';

export class ListAlunosBolsistasUseCase {
  constructor(private alunoRepository: IAlunoRepository) {}

  async execute(): Promise<AlunoResponseDTO[]> {
    const alunos = await this.alunoRepository.findByTipoAcesso(TipoAcessoAluno.ACESSO_BOLSISTA);
    
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