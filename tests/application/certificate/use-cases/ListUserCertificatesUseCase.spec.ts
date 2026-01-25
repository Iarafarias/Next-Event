import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ListUserCertificatesUseCase } from '../../../../src/application/certificate/use-cases/ListUserCertificatesUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('ListUserCertificatesUseCase', () => {
    let useCase: ListUserCertificatesUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new ListUserCertificatesUseCase(repository);
    });

    it('Deve filtrar por status', async () => {
        const c1 = new Certificate({ userId: 'u1', title: 'A', description: 'D', institution: 'I', workload: 1, startDate: new Date(), endDate: new Date(), certificateUrl: 'u', category: 'EVENTOS' as any });
        Object.assign(c1, { id: '1', status: 'approved' });
        
        const c2 = new Certificate({ userId: 'u1', title: 'B', description: 'D', institution: 'I', workload: 1, startDate: new Date(), endDate: new Date(), certificateUrl: 'u', category: 'EVENTOS' as any });
        Object.assign(c2, { id: '2', status: 'pending' });

        await repository.create(c1);
        await repository.create(c2);

        const approved = await useCase.execute({ userId: 'u1', status: 'approved' });
        expect(approved).toHaveLength(1);
        expect(approved[0].status).toBe('approved');
    });
});