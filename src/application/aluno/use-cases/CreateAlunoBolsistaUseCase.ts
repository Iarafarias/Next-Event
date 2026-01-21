import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { Aluno, TipoAcessoAluno } from '../../../domain/aluno/entities/Aluno';
import { CreateAlunoDTO } from '../dtos/AlunoDTO';

export class CreateAlunoBolsistaUseCase {
  constructor(
    private alunoRepository: IAlunoRepository,
    private usuarioRepository: IUsuarioRepository,
    private cursoRepository: ICursoRepository
  ) {}

  async execute(data: CreateAlunoDTO): Promise<void> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(data.usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o usuário já tem perfil de bolsista
    if (!usuario.bolsista) {
      throw new Error('Usuário deve ter perfil de bolsista para ser aluno-bolsista');
    }

    // Verificar se o curso existe
    const curso = await this.cursoRepository.findById(data.cursoId);
    if (!curso) {
      throw new Error('Curso não encontrado');
    }

    // Verificar se já existe aluno para este usuário
    const alunoExistente = await this.alunoRepository.findByUsuarioId(data.usuarioId);
    if (alunoExistente) {
      throw new Error('Usuário já possui perfil de aluno');
    }

    // Verificar se matrícula já existe
    const matriculaExistente = await this.alunoRepository.findByMatricula(data.matricula);
    if (matriculaExistente) {
      throw new Error('Matrícula já cadastrada');
    }

    // Criar aluno bolsista
    const aluno = Aluno.create({
      usuarioId: data.usuarioId,
      cursoId: data.cursoId,
      matricula: data.matricula,
      tipoAcesso: TipoAcessoAluno.ACESSO_BOLSISTA,
      anoIngresso: data.anoIngresso,
      semestre: data.semestre
    });

    await this.alunoRepository.save(aluno);
  }
}