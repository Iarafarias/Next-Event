import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateCertificateStatusUseCase } from '../../../../src/application/certificate/use-cases/UpdateCertificateStatusUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

// Mock do serviço de notificação
const mockNotificationUseCase = {
    execute: jest.fn()
} as any;

describe('UpdateCertificateStatusUseCase', () => {
    let useCase: UpdateCertificateStatusUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new UpdateCertificateStatusUseCase(repository, mockNotificationUseCase);
    });

    it('Deve atualizar status para rejected e notificar', async () => {
        const cert = new Certificate({
            userId: 'user-1', title: 'Cert', description: 'Desc', institution: 'Inst',
            workload: 10, startDate: new Date(), endDate: new Date(), certificateUrl: 'url', category: 'EVENTOS' as any
        });
        Object.assign(cert, { id: 'cert-1' });
        await repository.create(cert);

        await useCase.execute({ id: 'cert-1', status: 'rejected', adminComments: 'Inválido' });

        const updated = await repository.findById('cert-1');
        expect(updated?.status).toBe('rejected');
        expect(updated?.adminComments).toBe('Inválido');
        expect(mockNotificationUseCase.execute).toHaveBeenCalled();
    });
});