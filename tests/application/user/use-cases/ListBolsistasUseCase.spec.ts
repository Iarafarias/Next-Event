import { ListBolsistasUseCase } from '../../../../src/application/user/use-cases/ListBolsistasUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('ListBolsistasUseCase', () => {
  let repository: InMemoryUsuarioRepository;
  let useCase: ListBolsistasUseCase;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new ListBolsistasUseCase(repository as any);
  });

  it('Sucesso: Deve listar apenas usuários que possuem o perfil de bolsista', async () => {
    const bolsista = UsuarioBuilder.umUsuario().comoBolsista().build();
    await repository.save(bolsista);

    const resultado = await useCase.execute();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].bolsista).toBeDefined();
});

  it('Falha: Deve retornar uma lista vazia se não houver bolsistas', async () => {
    const resultado = await useCase.execute();
    expect(resultado).toEqual([]);
  });
});