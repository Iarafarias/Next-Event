import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ListCertificadosPorBolsistaUseCase } from '../../../../src/application/certificate/use-cases/ListCertificadosPorBolsistaUseCase';
import { ListCertificadosPorTutorUseCase } from '../../../../src/application/certificate/use-cases/ListCertificadosPorTutorUseCase';
import { EmitirCertificadoPorTutorUseCase } from '../../../../src/application/certificate/use-cases/EmitirCertificadoPorTutorUseCase';
import { SolicitarCertificadoPorBolsistaUseCase } from '../../../../src/application/certificate/use-cases/SolicitarCertificadoPorBolsistaUseCase';
import { InMemoryCertificateRepository } from '../../../builder/InMemoryCertificateRepository';
import { Certificate } from '../../../../src/domain/certificate/entities/Certificate';

describe('Casos de Uso Específicos de Perfil', () => {
    let repository: InMemoryCertificateRepository;

    beforeEach(() => {
        repository = new InMemoryCertificateRepository();
    });

    it('ListCertificadosPorBolsistaUseCase', async () => {
        const useCase = new ListCertificadosPorBolsistaUseCase(repository);
        const cert = new Certificate({
            userId: 'bolsista-1', title: 'C', description: 'D', institution: 'I', workload: 1, startDate: new Date(), endDate: new Date(), certificateUrl: 'u', category: 'EVENTOS' as any
        });
        Object.assign(cert, { id: '1' });
        await repository.create(cert);

        const list = await useCase.execute('bolsista-1');
        expect(list).toHaveLength(1);
    });

    it('ListCertificadosPorTutorUseCase', async () => {
        const useCase = new ListCertificadosPorTutorUseCase(repository);
        // O mock deve retornar tudo ou filtrar conforme a lógica no InMemory
        const list = await useCase.execute('tutor-1');
        expect(list).toBeDefined();
    });

    it('EmitirCertificadoPorTutorUseCase', async () => {
        const useCase = new EmitirCertificadoPorTutorUseCase(repository);
        const dados = {
            userId: 'aluno-x', title: 'Emitido', description: 'D', institution: 'I', workload: 10,
            startDate: new Date(), endDate: new Date(), certificateUrl: 'url', category: 'EVENTOS' as any
        } as any;

        const result = await useCase.execute('tutor-1', dados);
        expect(result).toBeDefined();
        expect(result.title).toBe('Emitido');
    });

    it('SolicitarCertificadoPorBolsistaUseCase', async () => {
        const useCase = new SolicitarCertificadoPorBolsistaUseCase(repository);
        const dados = {
            userId: 'bolsista-1', title: 'Solicitado', description: 'D', institution: 'I', workload: 10,
            startDate: new Date(), endDate: new Date(), certificateUrl: 'url', category: 'EVENTOS' as any
        } as any;

        const result = await useCase.execute('bolsista-1', dados);
        expect(result.title).toBe('Solicitado');
    });
});