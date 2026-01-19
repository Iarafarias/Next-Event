import { ListUsuariosUseCase } from '../../../../src/application/user/use-cases/ListUsersUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('ListUsuariosUseCase', () => {
  let repository: InMemoryUsuarioRepository;
  let useCase: ListUsuariosUseCase;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new ListUsuariosUseCase(repository);
  });

  it('Sucesso: Deve listar todos os usuários cadastrados (alunos e outros perfis)', async () => {
    const aluno = UsuarioBuilder.umUsuario().comoAluno().build();
    const coordenador = UsuarioBuilder.umUsuario().comoCoordenador().build();

    await repository.save(aluno);
    await repository.save(coordenador);

    const resultado = await useCase.execute();

    expect(resultado).toHaveLength(2);
    
    const alunoEncontrado = resultado.find(u => u.id === aluno.id);
    expect(alunoEncontrado).toBeDefined();
    expect(alunoEncontrado?.email).toBe(aluno.email);
  });

  it('Falha: Deve retornar uma lista vazia se não houver usuários no banco', async () => {
    const resultado = await useCase.execute();
    expect(resultado).toEqual([]);
  });
});