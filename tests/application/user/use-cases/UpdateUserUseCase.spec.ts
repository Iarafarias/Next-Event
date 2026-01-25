import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateUsuarioUseCase } from '../../../../src/application/user/use-cases/UpdateUserUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('UpdateUsuarioUseCase', () => {
  let useCase: UpdateUsuarioUseCase;
  let repository: InMemoryUsuarioRepository;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new UpdateUsuarioUseCase(repository);
  });

  it('Sucesso: Deve atualizar os dados de um usuário', async () => {
    const usuarioOriginal = UsuarioBuilder.umUsuario().build();
    await repository.save(usuarioOriginal);

    const updateDTO = {
      id: usuarioOriginal.id, 
      nome: 'Welington Atualizado'
    };

    const resultado = await useCase.execute(updateDTO as any);

    expect(resultado).not.toBeNull();
    expect(resultado?.nome).toBe('Welington Atualizado');
  });

  it('falha: Deve retornar null ao tentar atualizar usuário inexistente', async () => {
  const updateDTO = { id: 'id-inexistente', nome: 'Qualquer Nome' };

  const resultado = await useCase.execute(updateDTO as any);

  expect(resultado).toBeNull();
});
});