import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AtribuirPapelUseCase } from '../../../../src/application/user/use-cases/AtribuirPapelUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('AtribuirPapelUseCase', () => {
  let useCase: AtribuirPapelUseCase;
  let repository: InMemoryUsuarioRepository;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new AtribuirPapelUseCase(repository as any);
  });

  describe('AtribuirPapelUseCase - Casos de Sucesso e Falha', () => {
    //* Cobre os 3 papéis em um único bloco
    it.each([
      { papel: 'coordenador', campo: 'coordenador' },
      { papel: 'tutor', campo: 'tutor' },
      { papel: 'bolsista', campo: 'bolsista' }
    ])
    ('Sucesso: Deve atribuir o papel de $papel', async ({ papel, campo }) => {
      const usuario = UsuarioBuilder.umUsuario().build();
      await repository.save(usuario);

      await useCase.execute(usuario.id, { papel: papel as any, acao: 'atribuir' });

      const atualizado = await repository.findById(usuario.id) as any;
      expect(atualizado[campo]).toBeDefined();
      expect(atualizado[campo].id).toBeDefined();
    });

    it('Falha: Deve ignorar se o usuário não for encontrado', async () => {
      const idFake = crypto.randomUUID();
      await useCase.execute(idFake, { papel: 'tutor', acao: 'atribuir' });
      const lista = await repository.findAll();
      expect(lista.length).toBe(0);
    });
  });
  //TODO: Falta verificar se o usuário que solicitou a operação tem cargo suficiente para atribuir papel a algum outro usuário
});