import { PrismaClient } from '@prisma/client';
import { IRelatorioAcompanhamentoRepository } from '../../../domain/relatorioAcompanhamento/repositories/IRelatorioAcompanhamentoRepository';
import { CreateRelatorioAcompanhamentoDTO } from '../../../application/relatorioAcompanhamento/dtos/CreateRelatorioAcompanhamentoDTO';
import { UpdateRelatorioAcompanhamentoDTO } from '../../../application/relatorioAcompanhamento/dtos/UpdateRelatorioAcompanhamentoDTO';
import { RelatorioAcompanhamentoResponseDTO } from '../../../application/relatorioAcompanhamento/dtos/RelatorioAcompanhamentoResponseDTO';

const prisma = new PrismaClient();

export class PostgresRelatorioAcompanhamentoRepository implements IRelatorioAcompanhamentoRepository {
  async create(data: CreateRelatorioAcompanhamentoDTO): Promise<RelatorioAcompanhamentoResponseDTO> {
     const relatorioAcompanhamento = await prisma.relatorioAcompanhamento.create({ data });
     return {
      ...relatorioAcompanhamento,
      resultados: relatorioAcompanhamento.resultados === null ? undefined : relatorioAcompanhamento.resultados,
     };
  }

  async update(id: string, data: UpdateRelatorioAcompanhamentoDTO): Promise<RelatorioAcompanhamentoResponseDTO | null> {
      const relatorioAcompanhamento = await prisma.relatorioAcompanhamento.update({
        where: { id },
        data,
      });
      return relatorioAcompanhamento
        ? {
            ...relatorioAcompanhamento,
            resultados: relatorioAcompanhamento.resultados === null ? undefined : relatorioAcompanhamento.resultados,
          }
        : null;
  }

  async getById(id: string): Promise<RelatorioAcompanhamentoResponseDTO | null> {
      const relatorioAcompanhamento = await prisma.relatorioAcompanhamento.findUnique({ where: { id } });
      return relatorioAcompanhamento
        ? {
            ...relatorioAcompanhamento,
            resultados: relatorioAcompanhamento.resultados === null ? undefined : relatorioAcompanhamento.resultados,
          }
        : null;
  }

  async list(): Promise<RelatorioAcompanhamentoResponseDTO[]> {
     const relatorios = await prisma.relatorioAcompanhamento.findMany();
     return relatorios.map(r => ({
      ...r,
      resultados: r.resultados === null ? undefined : r.resultados,
     }));
  }

  async delete(id: string): Promise<void> {
    await prisma.relatorioAcompanhamento.delete({ where: { id } });
  }
}
