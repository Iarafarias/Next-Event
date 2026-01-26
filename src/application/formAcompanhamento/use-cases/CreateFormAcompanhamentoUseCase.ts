import { CreateFormAcompanhamentoDTO } from '../dtos/CreateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../dtos/FormAcompanhamentoResponseDTO';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateFormAcompanhamentoUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) { }

  async execute(data: CreateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO> {
    // Buscar nomes para enriquecer o conteúdo
    const [tutor, bolsista] = await Promise.all([
      prisma.usuario.findUnique({ where: { id: data.tutorId } }),
      prisma.usuario.findFirst({
        where: {
          OR: [
            { id: data.bolsistaId },
            { bolsista: { id: data.bolsistaId } }
          ]
        }
      })
    ]);

    // Ajuste para encontrar bolsista pelo ID do perfil se necessário
    let bolsistaNome = bolsista?.nome || '';
    if (!bolsistaNome) {
      const bProfile = await prisma.bolsista.findUnique({
        where: { id: data.bolsistaId },
        include: { usuario: true }
      });
      bolsistaNome = bProfile?.usuario.nome || '';
    }

    const tutorNome = tutor?.nome || '';

    return this.formAcompanhamentoRepository.create({
      ...data,
      nomeAluno: bolsistaNome,
      nomeTutor: tutorNome,
      dataPreenchimento: new Date()
    });
  }
}
