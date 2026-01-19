import { GetUsuarioByIdUseCase  } from '../../../../src/application/user/use-cases/GetUserByIdUseCase';
import { InMemoryUsuarioRepository } from './../../../builder/InMemoryUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';

describe('GetUserByIdUseCase', () => {
  let repository: InMemoryUsuarioRepository;
  let useCase: GetUsuarioByIdUseCase;

  beforeEach(() => {
    repository = new InMemoryUsuarioRepository();
    useCase = new GetUsuarioByIdUseCase(repository);
  });

  it('Sucesso: Deve retornar um usuário quando um ID válido for fornecido', async () => {
    const usuario = UsuarioBuilder.umUsuario().build();
    await repository.save(usuario);

    const resultado = await useCase.execute(usuario.id);

    expect(resultado).toBeDefined();
    expect(resultado?.id).toBe(usuario.id);
    expect(resultado?.email).toBe(usuario.email);
  });

  it('Falha: Deve retornar undefined (ou null) quando o usuário não existir', async () => {
    const resultado = await useCase.execute('id-inexistente');

    expect(resultado).toBeFalsy(); 
  });
});