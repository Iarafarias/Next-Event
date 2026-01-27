import { PrismaClient } from '@prisma/client';
import { IRelatorioAlunoRepository } from '../../../domain/relatorioAluno/repositories/IRelatorioAlunoRepository';
import { CreateRelatorioAlunoDTO } from '../../../application/relatorioAluno/dtos/CreateRelatorioAlunoDTO';
import { UpdateRelatorioAlunoDTO } from '../../../application/relatorioAluno/dtos/UpdateRelatorioAlunoDTO';
import { RelatorioAlunoResponseDTO } from '../../../application/relatorioAluno/dtos/RelatorioAlunoResponseDTO';

const prisma = new PrismaClient();

export class PostgresRelatorioAlunoRepository implements IRelatorioAlunoRepository {
  async create(data: CreateRelatorioAlunoDTO): Promise<RelatorioAlunoResponseDTO> {
    const relatorioAluno = await prisma.relatorioAluno.create({ data });
    return {
      ...relatorioAluno,
      observacoes: relatorioAluno.observacoes === null ? undefined : relatorioAluno.observacoes,
    };
  }

  async update(id: string, data: UpdateRelatorioAlunoDTO): Promise<RelatorioAlunoResponseDTO | null> {
    const relatorioAluno = await prisma.relatorioAluno.update({
      where: { id },
      data,
    });
    return relatorioAluno
      ? {
        ...relatorioAluno,
        observacoes: relatorioAluno.observacoes === null ? undefined : relatorioAluno.observacoes,
      }
      : null;
  }

  async getById(id: string): Promise<RelatorioAlunoResponseDTO | null> {
    const relatorioAluno = await prisma.relatorioAluno.findUnique({ where: { id } });
    return relatorioAluno
      ? {
        ...relatorioAluno,
        observacoes: relatorioAluno.observacoes === null ? undefined : relatorioAluno.observacoes,
      }
      : null;
  }

  async list(): Promise<RelatorioAlunoResponseDTO[]> {
    const relatorios = await prisma.relatorioAluno.findMany();
    return relatorios.map(r => ({
      ...r,
      observacoes: r.observacoes === null ? undefined : r.observacoes,
    }));
  }

  async delete(id: string): Promise<void> {
    await prisma.relatorioAluno.delete({ where: { id } });
  }
}
