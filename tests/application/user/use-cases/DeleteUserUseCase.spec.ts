import { DeleteUsuarioUseCase } from '../../../../src/application/user/use-cases/DeleteUserUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('DeleteUsuarioUseCase', () => {
  let useCase: DeleteUsuarioUseCase;
  let repository: InMemoryUsuarioRepository;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new DeleteUsuarioUseCase(repository);
  });

  it('Sucesso: Deve remover um usuário', async () => {
    const usuario = UsuarioBuilder.umUsuario().build();
    await repository.save(usuario);

    await useCase.execute(usuario.id);

    const encontrado = await repository.findById(usuario.id);
    expect(encontrado).toBeNull();
  });

  it('Falha: Deve retornar undefined (ou não lançar erro) ao tentar remover um usuário inexistente', async () => {
  const resultado = await useCase.execute('id-nao-existente');
  
  expect(resultado).toBeUndefined();
});
});