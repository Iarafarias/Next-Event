import { PrismaClient } from '@prisma/client';
import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { Aluno, TipoAcessoAluno } from '../../../domain/aluno/entities/Aluno';

export class PostgresAlunoRepository implements IAlunoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(aluno: Aluno): Promise<void> {
    await this.prisma.aluno.create({
      data: {
        id: aluno.id,
        usuarioId: aluno.usuarioId,
        cursoId: aluno.cursoId,
        matricula: aluno.matricula,
        tipoAcesso: aluno.tipoAcesso,
        anoIngresso: aluno.anoIngresso,
        semestre: aluno.semestre,
        ativo: aluno.ativo,
        criadoEm: aluno.criadoEm,
        atualizadoEm: aluno.atualizadoEm
      }
    });
  }

  async findById(id: string): Promise<Aluno | null> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        usuario: true,
        curso: true
      }
    });

    if (!aluno) return null;

    return new Aluno(
      aluno.id,
      aluno.usuarioId,
      aluno.cursoId,
      aluno.matricula,
      aluno.tipoAcesso as TipoAcessoAluno,
      aluno.anoIngresso || undefined,
      aluno.semestre || undefined,
      aluno.ativo,
      aluno.criadoEm,
      aluno.atualizadoEm
    );
  }

  async findByUsuarioId(usuarioId: string): Promise<Aluno | null> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { usuarioId },
      include: {
        usuario: true,
        curso: true
      }
    });

    if (!aluno) return null;

    return new Aluno(
      aluno.id,
      aluno.usuarioId,
      aluno.cursoId,
      aluno.matricula,
      aluno.tipoAcesso as TipoAcessoAluno,
      aluno.anoIngresso || undefined,
      aluno.semestre || undefined,
      aluno.ativo,
      aluno.criadoEm,
      aluno.atualizadoEm
    );
  }

  async findByMatricula(matricula: string): Promise<Aluno | null> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { matricula }
    });

    if (!aluno) return null;

    return new Aluno(
      aluno.id,
      aluno.usuarioId,
      aluno.cursoId,
      aluno.matricula,
      aluno.tipoAcesso as TipoAcessoAluno,
      aluno.anoIngresso || undefined,
      aluno.semestre || undefined,
      aluno.ativo,
      aluno.criadoEm,
      aluno.atualizadoEm
    );
  }

  async findByCursoId(cursoId: string): Promise<Aluno[]> {
    const alunos = await this.prisma.aluno.findMany({
      where: { cursoId },
      include: {
        usuario: true,
        curso: true
      },
      orderBy: { matricula: 'asc' }
    });

    return alunos.map(aluno => new Aluno(
      aluno.id,
      aluno.usuarioId,
      aluno.cursoId,
      aluno.matricula,
      aluno.tipoAcesso as TipoAcessoAluno,
      aluno.anoIngresso || undefined,
      aluno.semestre || undefined,
      aluno.ativo,
      aluno.criadoEm,
      aluno.atualizadoEm
    ));
  }

  async findByTipoAcesso(tipoAcesso: TipoAcessoAluno): Promise<Aluno[]> {
    const alunos = await this.prisma.aluno.findMany({
      where: { tipoAcesso },
      include: {
        usuario: true,
        curso: true
      },
      orderBy: { matricula: 'asc' }
    });

    return alunos.map(aluno => new Aluno(
      aluno.id,
      aluno.usuarioId,
      aluno.cursoId,
      aluno.matricula,
      aluno.tipoAcesso as TipoAcessoAluno,
      aluno.anoIngresso || undefined,
      aluno.semestre || undefined,
      aluno.ativo,
      aluno.criadoEm,
      aluno.atualizadoEm
    ));
  }

  async findAll(): Promise<Aluno[]> {
    const alunos = await this.prisma.aluno.findMany({
      include: {
        usuario: true,
        curso: true
      },
      orderBy: { matricula: 'asc' }
    });

    return alunos.map(aluno => new Aluno(
      aluno.id,
      aluno.usuarioId,
      aluno.cursoId,
      aluno.matricula,
      aluno.tipoAcesso as TipoAcessoAluno,
      aluno.anoIngresso || undefined,
      aluno.semestre || undefined,
      aluno.ativo,
      aluno.criadoEm,
      aluno.atualizadoEm
    ));
  }

  async update(aluno: Aluno): Promise<void> {
    await this.prisma.aluno.update({
      where: { id: aluno.id },
      data: {
        cursoId: aluno.cursoId,
        matricula: aluno.matricula,
        tipoAcesso: aluno.tipoAcesso,
        anoIngresso: aluno.anoIngresso,
        semestre: aluno.semestre,
        ativo: aluno.ativo,
        atualizadoEm: new Date()
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.aluno.delete({
      where: { id }
    });
  }

  async findAlunosComAcessoTutor(): Promise<Aluno[]> {
    return this.findByTipoAcesso(TipoAcessoAluno.ACESSO_TUTOR);
  }

  async findAlunosComAcessoBolsista(): Promise<Aluno[]> {
    return this.findByTipoAcesso(TipoAcessoAluno.ACESSO_BOLSISTA);
  }
}