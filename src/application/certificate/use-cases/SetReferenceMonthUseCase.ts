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
      throw new Error('Mês inválido. Deve estar entre 1 e 12');
    }

    if (data.year < 2000) {
      throw new Error('Ano inválido');
    }

    await (this.prisma as any).config.upsert({
      where: { id: 'singleton-config' },
      create: {
        id: 'singleton-config',
        referenceMonth: data.month,
        referenceYear: data.year,
      },
      update: {
        referenceMonth: data.month,
        referenceYear: data.year,
      },
    });
  }

  async getCurrentReference(): Promise<{ month: number; year: number } | null> {
    const config = await (this.prisma as any).config.findUnique({
      where: { id: 'singleton-config' }
    });

    if (!config || !config.referenceMonth || !config.referenceYear) {
      return null;
    }

    return {
      month: config.referenceMonth,
      year: config.referenceYear
    };
  }
} 