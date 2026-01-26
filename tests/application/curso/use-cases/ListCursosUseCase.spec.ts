import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryCursoRepository } from '../../../builder/InMemoryCursoRepository';
import { ListCursosUseCase } from '../../../../src/application/curso/use-cases/ListCursosUseCase';

describe('ListCursosUseCase', () => {
    let listCursosUseCase: ListCursosUseCase;
    let cursoRepository: InMemoryCursoRepository;

    beforeEach(() => {
        cursoRepository = new InMemoryCursoRepository();
        listCursosUseCase = new ListCursosUseCase(cursoRepository);
    });

    it('Deve listar todos os cursos cadastrados', async () => {
        // Arrange
        await cursoRepository.create({ nome: 'Engenharia de Software', codigo: 'ES01', descricao: 'Bacharelado' });
        await cursoRepository.create({ nome: 'Ciência da Computação', codigo: 'CC01', descricao: 'Bacharelado' });

        // Act
        const result = await listCursosUseCase.execute();

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('id');
        expect(result.some(c => c.codigo === 'ES01')).toBe(true);
    });

    it('Deve retornar lista vazia se não houver cursos', async () => {
        const result = await listCursosUseCase.execute();
        expect(result).toEqual([]);
    });
});