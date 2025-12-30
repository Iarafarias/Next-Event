import { PrismaClient } from '@prisma/client';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';
import { CreateAlocarTutorAlunoDTO } from '../../../application/alocarTutorAluno/dtos/CreateAlocarTutorAlunoDTO';
import { UpdateAlocarTutorAlunoDTO } from '../../../application/alocarTutorAluno/dtos/UpdateAlocarTutorAlunoDTO';
import { AlocarTutorAlunoResponseDTO } from '../../../application/alocarTutorAluno/dtos/AlocarTutorAlunoResponseDTO';

const prisma = new PrismaClient();

export class PostgresAlocarTutorAlunoRepository implements IAlocarTutorAlunoRepository {
  async create(data: CreateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO> {
    const alocacao = await prisma.alocarTutorAluno.create({ data });
    return {
      ...alocacao,
      dataFim: alocacao.dataFim === null ? undefined : alocacao.dataFim,
    };
  }

  async update(id: string, data: UpdateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO | null> {
    const alocacao = await prisma.alocarTutorAluno.update({
      where: { id },
      data,
    });
    return {
      ...alocacao,
      dataFim: alocacao.dataFim === null ? undefined : alocacao.dataFim,
    };
  }

  async getById(id: string): Promise<AlocarTutorAlunoResponseDTO | null> {
    const alocacao = await prisma.alocarTutorAluno.findUnique({ where: { id } });
    if (!alocacao) return null;
    return {
      ...alocacao,
      dataFim: alocacao.dataFim === null ? undefined : alocacao.dataFim,
    };
  }

  async list(): Promise<AlocarTutorAlunoResponseDTO[]> {
    const alocacoes = await prisma.alocarTutorAluno.findMany();
    return alocacoes.map(alocacao => ({
      ...alocacao,
      dataFim: alocacao.dataFim === null ? undefined : alocacao.dataFim,
    }));
  }

  async delete(id: string): Promise<void> {
    await prisma.alocarTutorAluno.delete({ where: { id } });
  }
}
