import { PrismaClient } from '@prisma/client';

interface SetReferenceMonthDTO {
  month: number;
  year: number;
}

export class SetReferenceMonthUseCase {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async execute(data: SetReferenceMonthDTO): Promise<void> {
    if (data.month < 1 || data.month > 12) {
      throw new Error('Invalid month. Must be between 1 and 12');
    }

    if (data.year < 2000) {
      throw new Error('Invalid year');
    }

    // Como o modelo 'config' não existe no banco, vamos usar o PeriodoTutoria ativo 
    // ou apenas validar a existência de um período para o upload.
    const activePeriod = await this.prisma.periodoTutoria.findFirst({
      where: { ativo: true }
    });

    if (!activePeriod) {
      throw new Error('Nenhum período de tutoria ativo encontrado para definir referência.');
    }
  }

  async getCurrentReference(): Promise<{ month: number; year: number } | null> {
    // Busca o período ativo para servir como referência de data
    const period = await this.prisma.periodoTutoria.findFirst({
      where: { ativo: true }
    });

    if (!period) {
      return null;
    }

    return {
      month: period.dataInicio.getMonth() + 1,
      year: period.dataInicio.getFullYear()
    };
  }
}
