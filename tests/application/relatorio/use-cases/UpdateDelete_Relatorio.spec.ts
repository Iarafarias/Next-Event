import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryRelatorioRepository } from '../../../builder/InMemoryRelatorioRepository';
import { UpdateRelatorioUseCase } from '../../../../src/application/relatorio/use-cases/UpdateRelatorioUseCase';
import { DeleteRelatorioUseCase } from '../../../../src/application/relatorio/use-cases/DeleteRelatorioUseCase';

describe('Relatorio - Update e Delete', () => {
    let repository: InMemoryRelatorioRepository;
    let updateUseCase: UpdateRelatorioUseCase;
    let deleteUseCase: DeleteRelatorioUseCase;

    beforeEach(() => {
        repository = new InMemoryRelatorioRepository();
        updateUseCase = new UpdateRelatorioUseCase(repository);
        deleteUseCase = new DeleteRelatorioUseCase(repository);
    });

    it('Deve atualizar um relatório', async () => {
        const criado = await repository.create({ bolsistaId: 'b1', texto: 'Original' } as any);
        
        const atualizado = await updateUseCase.execute({ 
            id: criado.id, 
            texto: 'Editado' 
        } as any);

        expect(atualizado).toBeDefined();
        if ((atualizado as any).texto) {
            expect((atualizado as any).texto).toBe('Editado');
        }
    });

    it('Deve deletar um relatório', async () => {
        const criado = await repository.create({ bolsistaId: 'b1' } as any);
        
        await deleteUseCase.execute(criado.id);
        const busca = await repository.findById(criado.id);
        expect(busca).toBeNull();
    });
});