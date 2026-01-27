import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryCargaHorariaMinimaRepository } from '../../../builder/InMemoryCargaHorariaMinimaRepository';
import { CreateCargaHorariaMinimaUseCase } from '../../../../src/application/cargaHorariaMinima/use-cases/CreateCargaHorariaMinimaUseCase';
import { ListCargaHorariaMinimaUseCase } from '../../../../src/application/cargaHorariaMinima/use-cases/ListCargaHorariaMinimaUseCase';
import { UpdateCargaHorariaMinimaUseCase } from '../../../../src/application/cargaHorariaMinima/use-cases/UpdateCargaHorariaMinimaUseCase';
import { DeleteCargaHorariaMinimaUseCase } from '../../../../src/application/cargaHorariaMinima/use-cases/DeleteCargaHorariaMinimaUseCase';

describe('Carga Horária Mínima Use Cases', () => {
    let repository: InMemoryCargaHorariaMinimaRepository;
    let createUseCase: CreateCargaHorariaMinimaUseCase;
    let listUseCase: ListCargaHorariaMinimaUseCase;
    let updateUseCase: UpdateCargaHorariaMinimaUseCase;
    let deleteUseCase: DeleteCargaHorariaMinimaUseCase;

    beforeEach(() => {
        repository = new InMemoryCargaHorariaMinimaRepository();
        createUseCase = new CreateCargaHorariaMinimaUseCase(repository);
        listUseCase = new ListCargaHorariaMinimaUseCase(repository);
        updateUseCase = new UpdateCargaHorariaMinimaUseCase(repository);
        deleteUseCase = new DeleteCargaHorariaMinimaUseCase(repository);
    });

    it('Deve definir carga horária mínima', async () => {
        const input = {
            periodoId: 'periodo-2024',
            categoria: 'MONITORIA' as const,
            horasMinimas: 10,
            descricao: 'Horas de monitoria obrigatória'
        };

        const result = await createUseCase.execute(input);
        expect(result).toHaveProperty('id');
        expect(result.horasMinimas).toBe(10);
    });

    it('Deve listar configurações', async () => {
        await repository.create({ periodoId: 'p1', categoria: 'EVENTOS', horasMinimas: 5 });
        await repository.create({ periodoId: 'p1', categoria: 'MONITORIA', horasMinimas: 10 });

        const result = await listUseCase.execute();
        expect(result).toHaveLength(2);
    });

    it('Deve atualizar carga horária', async () => {
        const criado = await repository.create({ periodoId: 'p1', categoria: 'EVENTOS', horasMinimas: 5 });
        
        const atualizado = await updateUseCase.execute(criado.id, {
            horasMinimas: 8
        });

        expect(atualizado).not.toBeNull();
        if(atualizado) {
            expect(atualizado.horasMinimas).toBe(8);
        }
    });

    it('Deve remover configuração', async () => {
        const criado = await repository.create({ periodoId: 'p1', categoria: 'EVENTOS', horasMinimas: 5 });
        
        await deleteUseCase.execute(criado.id);
        
        const busca = await repository.getById(criado.id);
        expect(busca).toBeNull();
    });
});