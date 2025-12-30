import { PrismaClient } from '@prisma/client';
import { IPeriodoTutoriaRepository } from '../../../domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';
import { CreatePeriodoTutoriaDTO } from '../../../application/periodoTutoria/dtos/CreatePeriodoTutoriaDTO';
import { UpdatePeriodoTutoriaDTO } from '../../../application/periodoTutoria/dtos/UpdatePeriodoTutoriaDTO';
import { PeriodoTutoriaResponseDTO } from '../../../application/periodoTutoria/dtos/PeriodoTutoriaResponseDTO';

const prisma = new PrismaClient();

export class PostgresPeriodoTutoriaRepository implements IPeriodoTutoriaRepository {

  async create(data: CreatePeriodoTutoriaDTO): Promise<PeriodoTutoriaResponseDTO> {
    const periodo = await prisma.periodoTutoria.create({ data });
    return {
      ...periodo,
      descricao: periodo.descricao === null ? undefined : periodo.descricao,
    };
  }


  async update(id: string, data: UpdatePeriodoTutoriaDTO): Promise<PeriodoTutoriaResponseDTO | null> {
    const periodo = await prisma.periodoTutoria.update({
      where: { id },
      data,
    });
    return {
      ...periodo,
      descricao: periodo.descricao === null ? undefined : periodo.descricao,
    };
  }


  async getById(id: string): Promise<PeriodoTutoriaResponseDTO | null> {
    const periodo = await prisma.periodoTutoria.findUnique({ where: { id } });
    if (!periodo) return null;
    return {
      ...periodo,
      descricao: periodo.descricao === null ? undefined : periodo.descricao,
    };
  }


  async list(): Promise<PeriodoTutoriaResponseDTO[]> {
    const periodos = await prisma.periodoTutoria.findMany();
    return periodos.map(periodo => ({
      ...periodo,
      descricao: periodo.descricao === null ? undefined : periodo.descricao,
    }));
  }

  async delete(id: string): Promise<void> {
    await prisma.periodoTutoria.delete({ where: { id } });
  }
}
