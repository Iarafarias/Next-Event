import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../../src/main'; 
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';
import { prisma } from '../../../../src/infrastructure/database/prisma';

describe('userRoutes', () => {
  
  const ROUTE_BASE = '/api/users/';
  const ROUTE_LOGIN = '/api/users/login';

  jest.setTimeout(30000);

  beforeAll(async () => {
    await prisma.relatorioCertificado.deleteMany().catch(() => {});
    await prisma.certificado.deleteMany().catch(() => {});
    await prisma.alocarTutorAluno.deleteMany().catch(() => {});
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.tutor.deleteMany().catch(() => {});
    await prisma.coordenador.deleteMany().catch(() => {});
    await prisma.aluno.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function obterToken(perfil: 'coordenador' | 'aluno') {
    const senha = 'senha_segura_123';
    const builder = UsuarioBuilder.umUsuario();
    const dto = perfil === 'coordenador' ? builder.comoCoordenador().buildDTO() : builder.comoAluno().buildDTO();
    dto.senha = senha;

    // Create user
    const createRes = await request(app).post(ROUTE_BASE).send(dto);
    if (createRes.status !== 201) {
       throw new Error(`Failed to create test user (${perfil}): ${JSON.stringify(createRes.body)}`);
    }

    const login = await request(app).post(ROUTE_LOGIN).send({
      email: dto.email,
      senha: senha
    });
    
    if (login.status !== 200 || !login.body.token) {
      throw new Error(`Login failed: Status ${login.status}, Body: ${JSON.stringify(login.body)}`);
    }
    
    return { 
      token: login.body.token, 
      id: login.body.usuario?.id || login.body.user?.id 
    };
  }

  describe('Fluxo de acesso', () => {
    it('Sucesso: Deve cadastrar um novo usuário', async () => {
      const dto = UsuarioBuilder.umUsuario().buildDTO();
      const response = await request(app).post(ROUTE_BASE).send(dto);
      expect(response.status).toBe(201);
      expect(response.body.usuario).toHaveProperty('id');
    });

    it('Sucesso: Deve realizar login e retornar token', async () => {
      const { token } = await obterToken('aluno');
      expect(token).toBeDefined();
    });
  });

  describe('Fluxo de consulta (GET)', () => {
    it('Sucesso: Coordenador deve listar todos os bolsistas', async () => {
      const { token } = await obterToken('coordenador');
      
      const response = await request(app)
        .get(`${ROUTE_BASE}bolsistas`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Falha: Aluno não deve ter permissão para listar bolsistas (403)', async () => {
      const { token } = await obterToken('aluno');
      const response = await request(app)
        .get(`${ROUTE_BASE}bolsistas`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it('Sucesso: Deve buscar um usuário específico pelo ID', async () => {
      const { id, token } = await obterToken('aluno');
      const response = await request(app)
        .get(`${ROUTE_BASE}${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
    });

    it('Falha: Deve retornar 404 para um ID inexistente', async () => {
      const { token } = await obterToken('coordenador');
      const response = await request(app)
        .get(`${ROUTE_BASE}00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
    
    it('Sucesso: Coordenador deve listar todos os coordenadores', async () => {
      const { token } = await obterToken('coordenador');
      
      const coordDTO = UsuarioBuilder.umUsuario().comoCoordenador().buildDTO();
      await request(app).post('/api/users').send(coordDTO);

      const response = await request(app)
        .get('/api/users/coordenadores')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      const encontrado = response.body.find((u: any) => u.email === coordDTO.email);
      if (encontrado) {
        expect(encontrado).toHaveProperty('coordenador');
      }
    });

    it('Sucesso: Coordenador deve listar todos os tutores', async () => {
      const { token } = await obterToken('coordenador');
    
      const tutorDTO = UsuarioBuilder.umUsuario().comoTutor().buildDTO();
      await request(app).post(ROUTE_BASE).send(tutorDTO);

      const response = await request(app)
        .get(`${ROUTE_BASE}tutores`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      const encontrado = response.body.find((u: any) => u.email === tutorDTO.email);
      if (encontrado) {
        expect(encontrado).toHaveProperty('tutor');
        expect(encontrado.tutor).toHaveProperty('area');
      }
    });

    describe('GET /api/users/ (Listagem Geral/Alunos)', () => {
        it('Sucesso: Coordenador deve conseguir listar todos os usuários', async () => {
          const { token } = await obterToken('coordenador');

          const response = await request(app)
            .get('/api/users/')
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          
          expect(response.body.length).toBeGreaterThanOrEqual(1);
        });

        it('Falha: Aluno NÃO deve ter permissão para listar todos os usuários (403)', async () => {
          const { token } = await obterToken('aluno');

          const response = await request(app)
            .get('/api/users/')
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).toBe(403);
        });

        it('Falha: Usuário não autenticado não deve acessar (401)', async () => {
          const response = await request(app).get('/api/users/');
          expect(response.status).toBe(401);
        });
    });
  });

  describe('Fluxo de manutenção (PUT/DELETE)', () => {
    it('Sucesso: Deve editar o nome do usuário', async () => {
      const { token, id } = await obterToken('aluno');
      const response = await request(app)
        .put(`${ROUTE_BASE}${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Nome Editado' });
      expect(response.status).toBe(200);
    });

    it('Sucesso: Coordenador deve remover usuário', async () => {
      const { token: tCoord } = await obterToken('coordenador');
      const { id: idAluno } = await obterToken('aluno');
      const response = await request(app)
        .delete(`${ROUTE_BASE}${idAluno}`)
        .set('Authorization', `Bearer ${tCoord}`);
      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Segurança - Atribuição de papel', () => {
    const ROUTE_PATCH = (id: string) => `${ROUTE_BASE}${id}/atribuir-papel`;

    it('SUCESSO: Coordenador atribui papel de Bolsista', async () => {
      const { token: tCoord } = await obterToken('coordenador');
      const { id: idAluno } = await obterToken('aluno');

      const userExists = await prisma.usuario.findUnique({ where: { id: idAluno } });
      if (!userExists) {
          throw new Error('User created in obterToken does not exist in DB');
      }

      await prisma.bolsista.deleteMany({ where: { usuarioId: idAluno } });

      const res = await request(app)
        .patch(ROUTE_PATCH(idAluno))
        .set('Authorization', `Bearer ${tCoord}`)
        .send({ papel: 'bolsista', acao: 'atribuir' });

      expect(res.status).toBe(204); 
    });

    it('FALHA: Aluno tenta atribuir papel (403)', async () => {
      const { token: tAluno } = await obterToken('aluno');
      const res = await request(app)
        .patch(ROUTE_PATCH('id-qualquer'))
        .set('Authorization', `Bearer ${tAluno}`)
        .send({ papel: 'coordenador', acao: 'atribuir' });
      expect(res.status).toBe(403);
    });

    it('FALHA: Tentativa sem token (Deve retornar 401)', async () => {
      const res = await request(app).patch(ROUTE_PATCH('id-qualquer'));
      expect(res.status).toBe(401);
    });
  });
});