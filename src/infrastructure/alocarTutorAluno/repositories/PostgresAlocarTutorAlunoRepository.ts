import { PrismaClient } from '@prisma/client';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';
import { CreateAlocarTutorAlunoDTO } from '../../../application/alocarTutorAluno/dtos/CreateAlocarTutorAlunoDTO';
import { UpdateAlocarTutorAlunoDTO } from '../../../application/alocarTutorAluno/dtos/UpdateAlocarTutorAlunoDTO';
import { AlocarTutorAlunoResponseDTO } from '../../../application/alocarTutorAluno/dtos/AlocarTutorAlunoResponseDTO';

const prisma = new PrismaClient();

export class PostgresAlocarTutorAlunoRepository implements IAlocarTutorAlunoRepository {
  async create(data: CreateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO> {
    // 1. Resolver/Criar Tutor
    let tutor = await prisma.tutor.findFirst({
      where: { OR: [{ id: data.tutorId }, { usuarioId: data.tutorId }] }
    });

    if (!tutor) {
      // Verificar se o usuário existe, se sim, criar o perfil de tutor
      const usuario = await prisma.usuario.findUnique({ where: { id: data.tutorId } });
      if (usuario) {
        tutor = await prisma.tutor.create({ data: { usuarioId: usuario.id } });
      } else {
        throw new Error(`Tutor não encontrado para o ID fornecido: ${data.tutorId}`);
      }
    }

    // 2. Resolver/Criar Bolsista
    let bolsista = await prisma.bolsista.findFirst({
      where: { OR: [{ id: data.bolsistaId }, { usuarioId: data.bolsistaId }] }
    });

    if (!bolsista) {
      // Verificar se o usuário existe, se sim, criar o perfil de bolsista
      const usuario = await prisma.usuario.findUnique({ where: { id: data.bolsistaId } });
      if (usuario) {
        bolsista = await prisma.bolsista.create({ data: { usuarioId: usuario.id } });
      } else {
        throw new Error(`Bolsista não encontrado para o ID fornecido: ${data.bolsistaId}`);
      }
    }

    // 3. Criar a alocação
    const alocacao = await prisma.alocarTutorAluno.create({
      data: {
        ...data,
        tutorId: tutor.id,
        bolsistaId: bolsista.id,
        dataInicio: new Date(data.dataInicio),
        dataFim: data.dataFim ? new Date(data.dataFim) : undefined
      }
    });

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
