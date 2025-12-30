import { PrismaClient } from '@prisma/client';
import { IRelatorioAvaliacaoRepository } from '../../../domain/relatorioAvaliacao/repositories/IRelatorioAvaliacaoRepository';
import { CreateRelatorioAvaliacaoDTO } from '../../../application/relatorioAvaliacao/dtos/CreateRelatorioAvaliacaoDTO';
import { UpdateRelatorioAvaliacaoDTO } from '../../../application/relatorioAvaliacao/dtos/UpdateRelatorioAvaliacaoDTO';
import { RelatorioAvaliacaoResponseDTO } from '../../../application/relatorioAvaliacao/dtos/RelatorioAvaliacaoResponseDTO';

const prisma = new PrismaClient();

export class PostgresRelatorioAvaliacaoRepository implements IRelatorioAvaliacaoRepository {
  async create(data: CreateRelatorioAvaliacaoDTO): Promise<RelatorioAvaliacaoResponseDTO> {
     const relatorioAvaliacao = await prisma.relatorioAvaliacao.create({ data });
     return {
      ...relatorioAvaliacao,
      nota: relatorioAvaliacao.nota === null ? undefined : relatorioAvaliacao.nota,
      comentarios: relatorioAvaliacao.comentarios === null ? undefined : relatorioAvaliacao.comentarios,
     };
  }

  async update(id: string, data: UpdateRelatorioAvaliacaoDTO): Promise<RelatorioAvaliacaoResponseDTO | null> {
      const relatorioAvaliacao = await prisma.relatorioAvaliacao.update({
        where: { id },
        data,
      });
      return relatorioAvaliacao
        ? {
            ...relatorioAvaliacao,
            nota: relatorioAvaliacao.nota === null ? undefined : relatorioAvaliacao.nota,
            comentarios: relatorioAvaliacao.comentarios === null ? undefined : relatorioAvaliacao.comentarios,
          }
        : null;
  }

  async getById(id: string): Promise<RelatorioAvaliacaoResponseDTO | null> {
      const relatorioAvaliacao = await prisma.relatorioAvaliacao.findUnique({ where: { id } });
      return relatorioAvaliacao
        ? {
            ...relatorioAvaliacao,
            nota: relatorioAvaliacao.nota === null ? undefined : relatorioAvaliacao.nota,
            comentarios: relatorioAvaliacao.comentarios === null ? undefined : relatorioAvaliacao.comentarios,
          }
        : null;
  }

  async list(): Promise<RelatorioAvaliacaoResponseDTO[]> {
     const relatorios = await prisma.relatorioAvaliacao.findMany();
     return relatorios.map(r => ({
      ...r,
      nota: r.nota === null ? undefined : r.nota,
      comentarios: r.comentarios === null ? undefined : r.comentarios,
     }));
  }

  async delete(id: string): Promise<void> {
    await prisma.relatorioAvaliacao.delete({ where: { id } });
  }
}
