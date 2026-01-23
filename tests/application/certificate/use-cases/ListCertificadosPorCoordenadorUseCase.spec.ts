import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ListCertificadosPorCoordenadorUseCase } from '../../../../src/application/certificate/use-cases/ListCertificadosPorCoordenadorUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('ListCertificadosPorCoordenadorUseCase', () => {
    let useCase: ListCertificadosPorCoordenadorUseCase;
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
        useCase = new ListCertificadosPorCoordenadorUseCase(repository);
    });

    it('Deve listar certificados para o coordenador visualizar', async () => {
        // --- Certificado 1 (Pendente) ---
        const cert1 = new Certificate({
            userId: 'a1', 
            title: 'C1', 
            description: 'D', 
            institution: 'I', 
            workload: 5,
            startDate: new Date('2024-01-01'), 
            endDate: new Date('2024-01-02'), 
            certificateUrl: 'u1',
            category: 'COMPLEMENTAR' as any
        });
        Object.assign(cert1, { id: 'c1' }); 
        await repository.create(cert1);

        // --- Certificado 2 (Aprovado) ---
        const cert2 = new Certificate({
            userId: 'a2', 
            title: 'C2', 
            description: 'D', 
            institution: 'I', 
            workload: 5,
            startDate: new Date('2024-01-01'), 
            endDate: new Date('2024-01-02'), 
            certificateUrl: 'u2',
            category: 'COMPLEMENTAR' as any
        });
        Object.assign(cert2, { id: 'c2' });
        cert2.status = 'approved'; 
        await repository.create(cert2);

        const resultado = await useCase.execute('coord-1');

        expect(resultado).toHaveLength(2);
        expect(resultado[0]).toHaveProperty('status');
    });
});