import { PrismaClient } from '@prisma/client';
import { IRelatorioTutorRepository } from '../../../domain/relatorioTutor/repositories/IRelatorioTutorRepository';
import { CreateRelatorioTutorDTO } from '../../../application/relatorioTutor/dtos/CreateRelatorioTutorDTO';
import { UpdateRelatorioTutorDTO } from '../../../application/relatorioTutor/dtos/UpdateRelatorioTutorDTO';
import { RelatorioTutorResponseDTO } from '../../../application/relatorioTutor/dtos/RelatorioTutorResponseDTO';

const prisma = new PrismaClient();

export class PostgresRelatorioTutorRepository implements IRelatorioTutorRepository {
  async create(data: CreateRelatorioTutorDTO): Promise<RelatorioTutorResponseDTO> {
     const relatorioTutor = await prisma.relatorioTutor.create({ data });
     return {
      ...relatorioTutor,
      alunosAtendidos: relatorioTutor.alunosAtendidos === null ? undefined : relatorioTutor.alunosAtendidos,
     };
  }

  async update(id: string, data: UpdateRelatorioTutorDTO): Promise<RelatorioTutorResponseDTO | null> {
      const relatorioTutor = await prisma.relatorioTutor.update({
        where: { id },
        data,
      });
      return relatorioTutor
        ? {
            ...relatorioTutor,
            alunosAtendidos: relatorioTutor.alunosAtendidos === null ? undefined : relatorioTutor.alunosAtendidos,
          }
        : null;
  }

  async getById(id: string): Promise<RelatorioTutorResponseDTO | null> {
      const relatorioTutor = await prisma.relatorioTutor.findUnique({ where: { id } });
      return relatorioTutor
        ? {
            ...relatorioTutor,
            alunosAtendidos: relatorioTutor.alunosAtendidos === null ? undefined : relatorioTutor.alunosAtendidos,
          }
        : null;
  }

  async list(): Promise<RelatorioTutorResponseDTO[]> {
     const relatorios = await prisma.relatorioTutor.findMany();
     return relatorios.map(r => ({
      ...r,
      alunosAtendidos: r.alunosAtendidos === null ? undefined : r.alunosAtendidos,
     }));
  }

  async delete(id: string): Promise<void> {
    await prisma.relatorioTutor.delete({ where: { id } });
  }
}
