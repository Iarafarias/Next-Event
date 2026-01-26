import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryPeriodoTutoriaRepository } from '../../../builder/InMemoryPeriodoTutoriaRepository';
import { CreatePeriodoTutoriaUseCase } from '../../../../src/application/periodoTutoria/use-cases/CreatePeriodoTutoriaUseCase';
import { ListPeriodosTutoriaUseCase } from '../../../../src/application/periodoTutoria/use-cases/ListPeriodosTutoriaUseCase';
import { UpdatePeriodoTutoriaUseCase } from '../../../../src/application/periodoTutoria/use-cases/UpdatePeriodoTutoriaUseCase';
import { DeletePeriodoTutoriaUseCase } from '../../../../src/application/periodoTutoria/use-cases/DeletePeriodoTutoriaUseCase';

describe('PeriodoTutoria Use Cases', () => {
    let repository: InMemoryPeriodoTutoriaRepository;
    let createUseCase: CreatePeriodoTutoriaUseCase;
    let listUseCase: ListPeriodosTutoriaUseCase;
    let updateUseCase: UpdatePeriodoTutoriaUseCase;
    let deleteUseCase: DeletePeriodoTutoriaUseCase;

    beforeEach(() => {
        repository = new InMemoryPeriodoTutoriaRepository();
        createUseCase = new CreatePeriodoTutoriaUseCase(repository);
        listUseCase = new ListPeriodosTutoriaUseCase(repository);
        updateUseCase = new UpdatePeriodoTutoriaUseCase(repository);
        deleteUseCase = new DeletePeriodoTutoriaUseCase(repository);
    });

    it('Deve criar um período de tutoria', async () => {
        const data = {
            nome: '2024.1',
            dataInicio: new Date('2024-02-01'),
            dataFim: new Date('2024-06-30'),
            ativo: true
        };

        const result = await createUseCase.execute(data);
        expect(result).toHaveProperty('id');
        expect(result.nome).toBe('2024.1');
    });

    it('Deve listar períodos', async () => {
        await repository.create({ nome: 'P1', dataInicio: new Date(), dataFim: new Date() });
        await repository.create({ nome: 'P2', dataInicio: new Date(), dataFim: new Date() });

        const result = await listUseCase.execute();
        expect(result).toHaveLength(2);
    });

    it('Deve atualizar um período', async () => {
        const criado = await repository.create({ nome: 'Antigo', dataInicio: new Date(), dataFim: new Date() });
        
        // Passando ID e DTO separadamente conforme assinatura do caso de uso
        const atualizado = await updateUseCase.execute(criado.id, {
            nome: 'Novo Nome'
        });

        expect(atualizado).not.toBeNull();
        if(atualizado) {
            expect(atualizado.nome).toBe('Novo Nome');
        }
    });

    it('Deve deletar um período', async () => {
        const criado = await repository.create({ nome: 'Delete Me', dataInicio: new Date(), dataFim: new Date() });
        
        await deleteUseCase.execute(criado.id);
        
        const busca = await repository.getById(criado.id);
        expect(busca).toBeNull();
    });
});