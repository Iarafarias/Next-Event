import { ListTutoresUseCase } from '../../../../src/application/user/use-cases/ListTutoresUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('ListTutoresUseCase', () => {
  let repository: InMemoryUsuarioRepository;
  let useCase: ListTutoresUseCase;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new ListTutoresUseCase(repository as any);
  });

  it('Sucesso: Deve listar apenas usuários que possuem o perfil de tutor', async () => {
    const tutor = UsuarioBuilder.umUsuario().comoTutor().build();
    const aluno = UsuarioBuilder.umUsuario().comoAluno().build();

    await repository.save(tutor);
    await repository.save(aluno);

    const resultado = await useCase.execute();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(tutor.id);
    
    expect(resultado[0].tutor).toBeDefined(); 
    expect(resultado[0].tutor?.area).toBeDefined();
  });

  it('Falha: Deve retornar uma lista vazia se não houver tutores', async () => {
    const resultado = await useCase.execute();
    expect(resultado).toEqual([]);
  });
});