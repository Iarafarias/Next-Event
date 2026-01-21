import { ListBolsistasUseCase } from '../../../../src/application/user/use-cases/ListBolsistasUseCase';
import { IUsuarioRepository } from '../../../../src/domain/user/repositories/IUsuarioRepository';
import { Usuario } from '../../../../src/domain/user/entities/Usuario';

describe('ListBolsistasUseCase', () => {
  let repository: jest.Mocked<IUsuarioRepository>;
  let useCase: ListBolsistasUseCase;

  beforeEach(() => {
    repository = {
      listByRole: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new ListBolsistasUseCase(repository);
  });

  it('Sucesso: Deve listar apenas usuários que possuem o perfil de bolsista', async () => {
    const bolsista = new Usuario({
      nome: 'Maria Bolsista',
      email: 'maria.bolsista@test.com',
      senha: 'senha123',
      status: 'ATIVO',
      bolsista: { id: '1', usuarioId: '1', curso: 'Engenharia', anoIngresso: 2024 }
    });
    
    repository.listByRole.mockResolvedValue([bolsista]);

    const resultado = await useCase.execute();

    expect(repository.listByRole).toHaveBeenCalledWith('bolsista');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(bolsista.id);
    expect(resultado[0].nome).toBe(bolsista.nome);
    expect(resultado[0].bolsista).toBeDefined();
  });

  it('Falha: Deve retornar uma lista vazia se não houver bolsistas', async () => {
    repository.listByRole.mockResolvedValue([]);
    
    const resultado = await useCase.execute();
    
    expect(resultado).toEqual([]);
  });
});