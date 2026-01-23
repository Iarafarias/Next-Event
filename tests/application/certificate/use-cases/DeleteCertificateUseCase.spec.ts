import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DeleteCertificateUseCase } from '../../../../src/application/certificate/use-cases/DeleteCertificateUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('DeleteCertificateUseCase', () => {
    let useCase: DeleteCertificateUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new DeleteCertificateUseCase(repository);
    });

    it('Deve deletar um certificado existente', async () => {
        const cert = new Certificate({
            userId: 'user-1', title: 'Cert', description: 'Desc', institution: 'Inst',
            workload: 10, startDate: new Date(), endDate: new Date(), certificateUrl: 'url', category: 'EVENTOS' as any
        });
        Object.assign(cert, { id: 'cert-1' });
        await repository.create(cert);

        await useCase.execute({ id: 'cert-1', userId: 'user-1' });

        const busca = await repository.findById('cert-1');
        expect(busca).toBeNull();
    });

    it('Deve impedir deleção por usuário não autorizado', async () => {
        const cert = new Certificate({
            userId: 'dono-real', title: 'Cert', description: 'Desc', institution: 'Inst',
            workload: 10, startDate: new Date(), endDate: new Date(), certificateUrl: 'url', category: 'EVENTOS' as any
        });
        Object.assign(cert, { id: 'cert-2' });
        await repository.create(cert);

        await expect(useCase.execute({ id: 'cert-2', userId: 'impostor' }))
            .rejects.toThrow('Unauthorized');
    });

    it('Deve lançar erro se certificado não existe', async () => {
        await expect(useCase.execute({ id: 'inexistente' }))
            .rejects.toThrow('Certificate not found');
    });
});