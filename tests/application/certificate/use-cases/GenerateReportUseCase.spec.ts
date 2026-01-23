import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GenerateReportUseCase } from '../../../../src/application/certificate/use-cases/GenerateReportUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('GenerateReportUseCase', () => {
    let useCase: GenerateReportUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new GenerateReportUseCase(repository);
    });

    it('Deve categorizar certificados válidos e inválidos baseados na data', async () => {
        // Mês de referência: Janeiro 2024
        
        // Certificado Válido (Dentro de Jan 2024)
        const valid = new Certificate({
            userId: 'u1', title: 'Valid', description: 'D', institution: 'I', workload: 10,
            startDate: new Date('2024-01-05'), endDate: new Date('2024-01-10'), certificateUrl: 'u', category: 'EVENTOS' as any
        });
        Object.assign(valid, { id: 'v1' });

        // Certificado Inválido (Fora de Jan 2024)
        const invalid = new Certificate({
            userId: 'u2', title: 'Invalid', description: 'D', institution: 'I', workload: 5,
            startDate: new Date('2023-12-01'), endDate: new Date('2023-12-05'), certificateUrl: 'u', category: 'EVENTOS' as any
        });
        Object.assign(invalid, { id: 'i1' });

        await repository.create(valid);
        await repository.create(invalid);

        const report = await useCase.execute({ month: 1, year: 2024 });

        expect(report.totalHoursValid).toBe(10);
        expect(report.totalHoursInvalid).toBe(5);
        expect(report.validCertificates).toHaveLength(1);
    });
});