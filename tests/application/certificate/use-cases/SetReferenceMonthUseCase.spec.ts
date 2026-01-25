import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SetReferenceMonthUseCase } from '../../../../src/application/certificate/use-cases/SetReferenceMonthUseCase';

// Mock do Prisma
const mockUpsert = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            return {
                config: {
                    upsert: mockUpsert,
                    findUnique: mockFindUnique
                }
            };
        })
    };
});

describe('SetReferenceMonthUseCase', () => {
    let useCase: SetReferenceMonthUseCase;

    beforeEach(() => {
        useCase = new SetReferenceMonthUseCase();
        jest.clearAllMocks();
    });

    it('Deve definir mês de referência com sucesso', async () => {
        await useCase.execute({ month: 5, year: 2024 });
        expect(mockUpsert).toHaveBeenCalled();
    });

    it('Deve validar mês inválido', async () => {
        await expect(useCase.execute({ month: 13, year: 2024 }))
            .rejects.toThrow('Invalid month');
    });
});