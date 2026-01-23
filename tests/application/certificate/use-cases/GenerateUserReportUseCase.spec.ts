import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GenerateUserReportUseCase } from '../../../../src/application/certificate/use-cases/GenerateUserReportUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('GenerateUserReportUseCase', () => {
    let useCase: GenerateUserReportUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new GenerateUserReportUseCase(repository);
    });

    it('Deve gerar relatório correto do usuário', async () => {
        // Criar 2 certificados (1 aprovado, 1 pendente)
        const c1 = new Certificate({
            userId: 'u1', title: 'C1', description: 'D', institution: 'I', workload: 10,
            startDate: new Date(), endDate: new Date(), certificateUrl: 'u', category: 'EVENTOS' as any
        });
        Object.assign(c1, { id: '1', status: 'approved' });
        
        const c2 = new Certificate({
            userId: 'u1', title: 'C2', description: 'D', institution: 'I', workload: 5,
            startDate: new Date(), endDate: new Date(), certificateUrl: 'u', category: 'EVENTOS' as any
        });
        Object.assign(c2, { id: '2', status: 'pending' });

        await repository.create(c1);
        await repository.create(c2);

        const report = await useCase.execute('u1');

        expect(report.totalCertificates).toBe(2);
        expect(report.totalWorkload).toBe(15);
        expect(report.approvedCertificates).toBe(1);
        expect(report.pendingCertificates).toBe(1);
    });
});