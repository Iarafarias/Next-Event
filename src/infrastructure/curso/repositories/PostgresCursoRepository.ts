import { PrismaClient } from '@prisma/client';
import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { Curso } from '../../../domain/curso/entities/Curso';

export class PostgresCursoRepository implements ICursoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(curso: Curso): Promise<void> {
    await this.prisma.curso.create({
      data: {
        id: curso.id,
        nome: curso.nome,
        codigo: curso.codigo,
        descricao: curso.descricao,
        ativo: curso.ativo,
        criadoEm: curso.criadoEm,
        atualizadoEm: curso.atualizadoEm
      }
    });
  }

  async findById(id: string): Promise<Curso | null> {
    const curso = await this.prisma.curso.findUnique({
      where: { id }
    });

    if (!curso) return null;

    return new Curso(
      curso.id,
      curso.nome,
      curso.codigo,
      curso.descricao || undefined,
      curso.ativo,
      curso.criadoEm,
      curso.atualizadoEm
    );
  }

  async findByCodigo(codigo: string): Promise<Curso | null> {
    const curso = await this.prisma.curso.findUnique({
      where: { codigo }
    });

    if (!curso) return null;

    return new Curso(
      curso.id,
      curso.nome,
      curso.codigo,
      curso.descricao || undefined,
      curso.ativo,
      curso.criadoEm,
      curso.atualizadoEm
    );
  }

  async findByNome(nome: string): Promise<Curso[]> {
    const cursos = await this.prisma.curso.findMany({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive'
        }
      },
      orderBy: { nome: 'asc' }
    });

    return cursos.map(curso => new Curso(
      curso.id,
      curso.nome,
      curso.codigo,
      curso.descricao || undefined,
      curso.ativo,
      curso.criadoEm,
      curso.atualizadoEm
    ));
  }

  async findAll(): Promise<Curso[]> {
    const cursos = await this.prisma.curso.findMany({
      orderBy: { nome: 'asc' }
    });

    return cursos.map(curso => new Curso(
      curso.id,
      curso.nome,
      curso.codigo,
      curso.descricao || undefined,
      curso.ativo,
      curso.criadoEm,
      curso.atualizadoEm
    ));
  }

  async findAtivos(): Promise<Curso[]> {
    const cursos = await this.prisma.curso.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });

    return cursos.map(curso => new Curso(
      curso.id,
      curso.nome,
      curso.codigo,
      curso.descricao || undefined,
      curso.ativo,
      curso.criadoEm,
      curso.atualizadoEm
    ));
  }

  async update(curso: Curso): Promise<void> {
    await this.prisma.curso.update({
      where: { id: curso.id },
      data: {
        nome: curso.nome,
        codigo: curso.codigo,
        descricao: curso.descricao,
        ativo: curso.ativo,
        atualizadoEm: new Date()
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.curso.delete({
      where: { id }
    });
  }
}