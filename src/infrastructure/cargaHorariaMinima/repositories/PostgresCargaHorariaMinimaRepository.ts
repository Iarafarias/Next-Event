import { PrismaClient } from '@prisma/client';
import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';
import { CreateCargaHorariaMinimaDTO } from '../../../application/cargaHorariaMinima/dtos/CreateCargaHorariaMinimaDTO';
import { UpdateCargaHorariaMinimaDTO } from '../../../application/cargaHorariaMinima/dtos/UpdateCargaHorariaMinimaDTO';
import { CargaHorariaMinimaResponseDTO } from '../../../application/cargaHorariaMinima/dtos/CargaHorariaMinimaResponseDTO';

const prisma = new PrismaClient();

export class PostgresCargaHorariaMinimaRepository implements ICargaHorariaMinimaRepository {
  async create(data: CreateCargaHorariaMinimaDTO): Promise<CargaHorariaMinimaResponseDTO> {
    const carga = await prisma.cargaHorariaMinima.upsert({
      where: {
        periodoId_categoria: {
          periodoId: data.periodoId,
          categoria: data.categoria
        }
      },
      update: {
        horasMinimas: data.horasMinimas,
        ...(data.descricao !== undefined && { descricao: data.descricao })
      },
      create: data
    });
    return {
      ...carga,
      descricao: carga.descricao === null ? undefined : carga.descricao,
    };
  }

  async update(id: string, data: UpdateCargaHorariaMinimaDTO): Promise<CargaHorariaMinimaResponseDTO | null> {
    const carga = await prisma.cargaHorariaMinima.update({
      where: { id },
      data,
    });
    return {
      ...carga,
      descricao: carga.descricao === null ? undefined : carga.descricao,
    };
  }

  async getById(id: string): Promise<CargaHorariaMinimaResponseDTO | null> {
    const carga = await prisma.cargaHorariaMinima.findUnique({ where: { id } });
    if (!carga) return null;
    return {
      ...carga,
      descricao: carga.descricao === null ? undefined : carga.descricao,
    };
  }

  async list(periodoId?: string): Promise<CargaHorariaMinimaResponseDTO[]> {
    const cargas = await prisma.cargaHorariaMinima.findMany({
      where: periodoId ? { periodoId } : undefined
    });
    return cargas.map(carga => ({
      ...carga,
      descricao: carga.descricao === null ? undefined : carga.descricao,
    }));
  }


  async delete(id: string): Promise<void> {
    await prisma.cargaHorariaMinima.delete({ where: { id } });
  }
}
