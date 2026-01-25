import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ValidarCertificadoPorCoordenadorUseCase } from '../../../../src/application/certificate/use-cases/ValidarCertificadoPorCoordenadorUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('ValidarCertificadoPorCoordenadorUseCase', () => {
    let useCase: ValidarCertificadoPorCoordenadorUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new ValidarCertificadoPorCoordenadorUseCase(repository);
    });

    it('Deve aprovar um certificado pendente', async () => {
        const cert = new Certificate({
            userId: 'aluno-1',
            title: 'Curso Teste',
            description: 'Desc',
            institution: 'Inst',
            workload: 10,
            startDate: new Date(),
            endDate: new Date(),
            certificateUrl: 'http://url.com',
            category: 'COMPLEMENTAR' as any
        });
        Object.assign(cert, { id: 'cert-1' });
        await repository.create(cert);

        // Coordenador aprova (true)
        await useCase.execute('cert-1', 'coord-1', true, 'Parabéns!'); 

        const atualizado = await repository.findById('cert-1');
        expect(atualizado?.status).toBe('approved');
    });

    it('Deve rejeitar um certificado', async () => {
        const cert = new Certificate({
            userId: 'aluno-1',
            title: 'Curso Ruim',
            description: 'Desc',
            institution: 'Inst',
            workload: 10,
            startDate: new Date(),
            endDate: new Date(),
            certificateUrl: 'http://url.com',
            category: 'COMPLEMENTAR' as any
        });
        Object.assign(cert, { id: 'cert-2' });
        await repository.create(cert);

        // Coordenador rejeita (false)
        await useCase.execute('cert-2', 'coord-1', false, 'Arquivo ilegível');

        const atualizado = await repository.findById('cert-2');
        expect(atualizado?.status).toBe('rejected');
    });
});