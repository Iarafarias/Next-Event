import { PrismaClient } from '@prisma/client';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import { CreateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/CreateFormAcompanhamentoDTO';
import { UpdateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/UpdateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../../../application/formAcompanhamento/dtos/FormAcompanhamentoResponseDTO';

const prisma = new PrismaClient();

export class PostgresFormAcompanhamentoRepository implements IFormAcompanhamentoRepository {
  async create(data: CreateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO> {
    const form = await prisma.formAcompanhamento.create({ data });
    return {
      ...form,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    };
  }

  async update(id: string, data: UpdateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO | null> {
    const form = await prisma.formAcompanhamento.update({
      where: { id },
      data,
    });
    return {
      ...form,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    };
  }

  async getById(id: string): Promise<FormAcompanhamentoResponseDTO | null> {
    const form = await prisma.formAcompanhamento.findUnique({ where: { id } });
    if (!form) return null;
    return {
      ...form,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    };
  }

  async list(): Promise<FormAcompanhamentoResponseDTO[]> {
    const forms = await prisma.formAcompanhamento.findMany();
    return forms.map(form => ({
      ...form,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    }));
  }

  async delete(id: string): Promise<void> {
    await prisma.formAcompanhamento.delete({ where: { id } });
  }
}
