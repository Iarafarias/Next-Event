import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateCertificateRequestUseCase } from '../../../../src/application/certificate/use-cases/CreateCertificateRequestUseCase';

const mockRequestRepo = {
    create: jest.fn().mockImplementation(async (data) => data),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    list: jest.fn()
};

describe('CreateCertificateRequestUseCase', () => {
    let useCase: CreateCertificateRequestUseCase;

    beforeEach(() => {
        useCase = new CreateCertificateRequestUseCase(mockRequestRepo as any);
    });

    it('Deve criar solicitação com status open', async () => {
        const input = {
            userId: 'user-1',
            description: 'Solicitação de horas complementares',
            month: 5,
            year: 2024,
            startDate: new Date(),
            endDate: new Date(),
        };

        const result = await useCase.execute(input);

        expect(result).toHaveProperty('id');
        expect(result.status).toBe('open');
        expect(mockRequestRepo.create).toHaveBeenCalled();
    });
});