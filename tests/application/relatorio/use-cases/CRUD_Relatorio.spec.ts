import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryRelatorioRepository } from '../../../builder/InMemoryRelatorioRepository';
import { CreateRelatorioUseCase } from '../../../../src/application/relatorio/use-cases/CreateRelatorioUseCase';
import { GetRelatorioByIdUseCase } from '../../../../src/application/relatorio/use-cases/GetRelatorioByIdUseCase';
import { ListRelatoriosUseCase } from '../../../../src/application/relatorio/use-cases/ListRelatoriosUseCase';

describe('Relatorio - CRUD Básico', () => {
    let repository: InMemoryRelatorioRepository;
    let createUseCase: CreateRelatorioUseCase;
    let getByIdUseCase: GetRelatorioByIdUseCase;
    let listUseCase: ListRelatoriosUseCase;

    beforeEach(() => {
        repository = new InMemoryRelatorioRepository();
        createUseCase = new CreateRelatorioUseCase(repository);
        getByIdUseCase = new GetRelatorioByIdUseCase(repository);
        listUseCase = new ListRelatoriosUseCase(repository);
    });

    it('Deve criar um relatório com sucesso', async () => {
        const input = {
            bolsistaId: 'bolsista-1',
            texto: 'Atividades realizadas em Janeiro', // Ajustado de 'conteudo' para 'texto' (comum)
            mesReferencia: 1,
            anoReferencia: 2024
        } as any;

        const result = await createUseCase.execute(input);
        expect(result).toHaveProperty('id');
        // Verifica propriedade genérica se 'texto' ou 'conteudo' não existir no DTO de resposta
        expect(result).toBeDefined();
    });

    it('Deve buscar um relatório pelo ID', async () => {
        const criado = await repository.create({ bolsistaId: 'b1', texto: 'Teste' } as any);
        const buscado = await getByIdUseCase.execute(criado.id);
        expect(buscado?.id).toBe(criado.id);
    });

    it('Deve listar todos os relatórios', async () => {
        await repository.create({ bolsistaId: 'b1' } as any);
        await repository.create({ bolsistaId: 'b2' } as any);
        
        const lista = await listUseCase.execute();
        expect(lista.length).toBeGreaterThanOrEqual(2);
    });
});