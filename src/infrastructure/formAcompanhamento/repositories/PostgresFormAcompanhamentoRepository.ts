import { PrismaClient } from '@prisma/client';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import { CreateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/CreateFormAcompanhamentoDTO';
import { UpdateFormAcompanhamentoDTO } from '../../../application/formAcompanhamento/dtos/UpdateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../../../application/formAcompanhamento/dtos/FormAcompanhamentoResponseDTO';

type FormAcompanhamentoConteudo = {
  modalidadeReuniao: 'VIRTUAL' | 'PRESENCIAL';
  maiorDificuldadeAluno: string;
  quantidadeReunioes: number;
  descricaoDificuldade: string;
  nomeAluno: string;
  nomeTutor: string;
  dataPreenchimento: Date;
};

const prisma = new PrismaClient();

export class PostgresFormAcompanhamentoRepository implements IFormAcompanhamentoRepository {
  async create(data: CreateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO> {
    const formData = {
      tutorId: data.tutorId,
      bolsistaId: data.bolsistaId, 
      periodoId: data.periodoId,
      observacoes: data.observacoes,
      dataEnvio: new Date(),
      conteudo: {
        modalidadeReuniao: data.modalidadeReuniao,
        maiorDificuldadeAluno: data.maiorDificuldadeAluno,
        quantidadeReunioes: data.quantidadeReunioes,
        descricaoDificuldade: data.descricaoDificuldade,
        nomeAluno: data.nomeAluno || '',
        nomeTutor: data.nomeTutor || '',
        dataPreenchimento: data.dataPreenchimento || new Date()
      }
    };
    
    const form = await prisma.formAcompanhamento.create({ 
      data: formData
    });
    return {
      id: form.id, periodoId: form.periodoId, conteudo: form.conteudo as unknown as FormAcompanhamentoConteudo, dataEnvio: form.dataEnvio, tutorId: form.tutorId, bolsistaId: form.bolsistaId,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    };
  }

  async update(id: string, data: UpdateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO | null> {
    const form = await prisma.formAcompanhamento.update({
      where: { id },
      data,
    });
    return {
      id: form.id, periodoId: form.periodoId, conteudo: form.conteudo as unknown as FormAcompanhamentoConteudo, dataEnvio: form.dataEnvio, tutorId: form.tutorId, bolsistaId: form.bolsistaId,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    };
  }

  async getById(id: string): Promise<FormAcompanhamentoResponseDTO | null> {
    const form = await prisma.formAcompanhamento.findUnique({ where: { id } });
    if (!form) return null;
    return {
      id: form.id, periodoId: form.periodoId, conteudo: form.conteudo as unknown as FormAcompanhamentoConteudo, dataEnvio: form.dataEnvio, tutorId: form.tutorId, bolsistaId: form.bolsistaId,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    };
  }

  async list(): Promise<FormAcompanhamentoResponseDTO[]> {
    const forms = await prisma.formAcompanhamento.findMany();
    return forms.map(form => ({
      id: form.id, periodoId: form.periodoId, conteudo: form.conteudo as unknown as FormAcompanhamentoConteudo, dataEnvio: form.dataEnvio, tutorId: form.tutorId, bolsistaId: form.bolsistaId,
      observacoes: form.observacoes === null ? undefined : form.observacoes,
    }));
  }

  async delete(id: string): Promise<void> {
    await prisma.formAcompanhamento.delete({ where: { id } });
  }
}
