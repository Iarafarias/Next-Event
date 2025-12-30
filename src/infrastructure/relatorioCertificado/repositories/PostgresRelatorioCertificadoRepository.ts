import { PrismaClient } from '@prisma/client';
import { IRelatorioCertificadoRepository } from '../../../domain/relatorioCertificado/repositories/IRelatorioCertificadoRepository';
import { CreateRelatorioCertificadoDTO } from '../../../application/relatorioCertificado/dtos/CreateRelatorioCertificadoDTO';
import { UpdateRelatorioCertificadoDTO } from '../../../application/relatorioCertificado/dtos/UpdateRelatorioCertificadoDTO';
import { RelatorioCertificadoResponseDTO } from '../../../application/relatorioCertificado/dtos/RelatorioCertificadoResponseDTO';

const prisma = new PrismaClient();

export class PostgresRelatorioCertificadoRepository implements IRelatorioCertificadoRepository {
  async create(data: CreateRelatorioCertificadoDTO): Promise<RelatorioCertificadoResponseDTO> {
     const relatorioCertificado = await prisma.relatorioCertificado.create({ data });
     return {
      ...relatorioCertificado,
      validacao: relatorioCertificado.validacao === null ? undefined : relatorioCertificado.validacao,
      observacoes: relatorioCertificado.observacoes === null ? undefined : relatorioCertificado.observacoes,
     };
  }

  async update(id: string, data: UpdateRelatorioCertificadoDTO): Promise<RelatorioCertificadoResponseDTO | null> {
      const relatorioCertificado = await prisma.relatorioCertificado.update({
        where: { id },
        data,
      });
      return relatorioCertificado
        ? {
            ...relatorioCertificado,
            validacao: relatorioCertificado.validacao === null ? undefined : relatorioCertificado.validacao,
            observacoes: relatorioCertificado.observacoes === null ? undefined : relatorioCertificado.observacoes,
          }
        : null;
  }

  async getById(id: string): Promise<RelatorioCertificadoResponseDTO | null> {
      const relatorioCertificado = await prisma.relatorioCertificado.findUnique({ where: { id } });
      return relatorioCertificado
        ? {
            ...relatorioCertificado,
            validacao: relatorioCertificado.validacao === null ? undefined : relatorioCertificado.validacao,
            observacoes: relatorioCertificado.observacoes === null ? undefined : relatorioCertificado.observacoes,
          }
        : null;
  }

  async list(): Promise<RelatorioCertificadoResponseDTO[]> {
     const relatorios = await prisma.relatorioCertificado.findMany();
     return relatorios.map(r => ({
      ...r,
      validacao: r.validacao === null ? undefined : r.validacao,
      observacoes: r.observacoes === null ? undefined : r.observacoes,
     }));
  }

  async delete(id: string): Promise<void> {
    await prisma.relatorioCertificado.delete({ where: { id } });
  }
}
