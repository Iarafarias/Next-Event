import { faker } from '@faker-js/faker';

import { Aluno, TipoAcessoAluno } from '../../src/domain/aluno/entities/Aluno';
import { Curso } from '../../src/domain/curso/entities/Curso';
import { Usuario } from '../../src/domain/user/entities/Usuario';
import { jest } from '@jest/globals';

/**
 * Test data builders for creating consistent test data
 */
export class TestDataBuilder {
  static createUsuario(overrides: Partial<any> = {}): Usuario {
    const userData = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      senha: faker.internet.password(),
      status: 'ATIVO' as const,
      ...overrides,
    };

    const usuario = new Usuario(userData);
    usuario.id = faker.string.uuid();
    return usuario;
  }

  static createCurso(overrides: Partial<any> = {}): Curso {
    return Curso.create({
      nome: faker.lorem.words(3),
      codigo: faker.string.alphanumeric(6).toUpperCase(),
      descricao: faker.lorem.sentence(),
      ativo: overrides?.ativo ?? true,
      ...overrides,
    });
  }

  static createAluno(overrides: Partial<any> = {}): Aluno {
    return Aluno.create({
      usuarioId: faker.string.uuid(),
      cursoId: faker.string.uuid(),
      matricula: faker.string.numeric(8),
      tipoAcesso: faker.helpers.arrayElement([
        TipoAcessoAluno.ACESSO_TUTOR,
        TipoAcessoAluno.ACESSO_BOLSISTA,
      ]),
      anoIngresso: faker.number.int({ min: 2020, max: 2024 }),
      semestre: faker.number.int({ min: 1, max: 2 }),
      ...overrides,
    });
  }

  static createFormAcompanhamentoData(overrides: Partial<any> = {}) {
    return {
      id: faker.string.uuid(),
      tutor: { usuario: { nome: faker.person.fullName() } },
      bolsista: { usuario: { nome: faker.person.fullName() } },
      periodoId: faker.string.uuid(),
      conteudo: {
        modalidadeReuniao: faker.helpers.arrayElement(['VIRTUAL', 'PRESENCIAL']) as 'VIRTUAL' | 'PRESENCIAL',
        quantidadeReunioes: faker.number.int({ min: 1, max: 10 }),
      },
      dataEnvio: faker.date.recent(),
      observacoes: faker.lorem.sentence(),
      ...overrides,
    };
  }

  static createAvaliacaoTutoriaData(overrides: Partial<any> = {}) {
    return {
      usuarioId: faker.string.uuid(),
      periodoId: faker.string.uuid(),
      conteudo: {
        experiencia: faker.lorem.paragraph(),
        dificuldades: faker.lorem.sentence(),
        nivelSatisfacaoGeral: faker.helpers.arrayElement([
          'MUITO_INSATISFEITO',
          'INSATISFEITO',
          'NEUTRO',
          'SATISFEITO',
          'MUITO_SATISFEITO',
        ]),
        recomendariaPrograma: faker.datatype.boolean(),
        sugestoesMelhoria: faker.lorem.paragraph(),
        comentariosAdicionais: faker.lorem.sentence(),
      },
      ...overrides,
    };
  }

  static createCertificateData(overrides: Partial<any> = {}) {
    return {
      userId: faker.string.uuid(),
      title: faker.lorem.words(4),
      description: faker.lorem.sentence(),
      category: faker.helpers.arrayElement(['EVENTOS', 'MONITORIA', 'ESTUDOS_INDIVIDUAIS']),
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      ...overrides,
    };
  }
}

/**
 * Mock factories for repositories and services
 */
export class MockFactory {
  static createAlunoRepositoryMock() {
    return {
      save: jest.fn(),
      findById: jest.fn(),
      findByUsuarioId: jest.fn(),
      findByMatricula: jest.fn(),
      findByCursoId: jest.fn(),
      findByTipoAcesso: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAlunosComAcessoTutor: jest.fn(),
      findAlunosComAcessoBolsista: jest.fn(),
    };
  }

  static createUsuarioRepositoryMock() {
    return {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      listByRole: jest.fn(),
    };
  }

  static createCursoRepositoryMock() {
    return {
      save: jest.fn(),
      findById: jest.fn(),
      findByCodigo: jest.fn(),
      findByNome: jest.fn(),
      findAll: jest.fn(),
      findAtivos: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  static createFormAcompanhamentoRepositoryMock() {
    return {
      create: jest.fn(),
      update: jest.fn(),
      getById: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
    };
  }

  static createCertificateRepositoryMock() {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }
}

/**
 * Express request/response mocks for controller tests
 */
export class ExpressMocks {
  static createMockRequest(overrides: any = {}) {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: { userId: faker.string.uuid(), role: 'coordinator' },
      ...overrides,
    } as any;
  }

  static createMockResponse() {
    const res = {} as any;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  }
}
