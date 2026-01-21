import { Aluno, TipoAcessoAluno } from '../entities/Aluno';

export interface IAlunoRepository {
  save(aluno: Aluno): Promise<void>;
  findById(id: string): Promise<Aluno | null>;
  findByUsuarioId(usuarioId: string): Promise<Aluno | null>;
  findByMatricula(matricula: string): Promise<Aluno | null>;
  findByCursoId(cursoId: string): Promise<Aluno[]>;
  findByTipoAcesso(tipoAcesso: TipoAcessoAluno): Promise<Aluno[]>;
  findAll(): Promise<Aluno[]>;
  update(aluno: Aluno): Promise<void>;
  delete(id: string): Promise<void>;
  findAlunosComAcessoTutor(): Promise<Aluno[]>;
  findAlunosComAcessoBolsista(): Promise<Aluno[]>;
}