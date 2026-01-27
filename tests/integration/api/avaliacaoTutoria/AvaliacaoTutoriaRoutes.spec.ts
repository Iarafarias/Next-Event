import request from 'supertest';
import { app } from './../../../../src/main'; 
import { prisma } from './../../../../src/infrastructure/database/prisma';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import jwt from 'jsonwebtoken';

const gerarToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'segredo_padrao_testes'; 
  return jwt.sign(
    { 
      sub: userId, // <--- IMPORTANTE: Muitos middlewares buscam o ID aqui (subject)
      id: userId,  // Mantemos aqui por garantia
      email: 'teste@teste.com', 
      role 
    }, 
    secret, 
    { expiresIn: '1h' }
  );
};

describe('Avaliação Tutoria - Rotas API', () => {
  let tokenAluno: string;
  let alunoId: string;
  let periodoId: string;
  let cursoId: string;

  beforeAll(async () => {
    // === 1. LIMPEZA (Ordem correta) ===
    await prisma.avaliacaoTutoria.deleteMany();
    
    // Limpa dependências
    if ((prisma as any).relatorio) await (prisma as any).relatorio.deleteMany();
    if ((prisma as any).alocarTutorAluno) await (prisma as any).alocarTutorAluno.deleteMany();
    if ((prisma as any).formAcompanhamento) await (prisma as any).formAcompanhamento.deleteMany();
    if ((prisma as any).aluno) await (prisma as any).aluno.deleteMany();
    if ((prisma as any).curso) await (prisma as any).curso.deleteMany();

    await prisma.periodoTutoria.deleteMany();
    
    if ((prisma as any).usuario) await (prisma as any).usuario.deleteMany();
    else if ((prisma as any).users) await (prisma as any).users.deleteMany();

    // === 2. CRIAÇÃO ===
    
    // A. Criar Período
    const periodo = await prisma.periodoTutoria.create({
      data: {
        nome: '2024.1-TESTE',
        dataInicio: new Date(),
        dataFim: new Date(new Date().setMonth(new Date().getMonth() + 6))
      }
    });
    periodoId = periodo.id;

    // B. Criar Curso
    const curso = await (prisma as any).curso.create({
      data: {
        nome: 'Ciência da Computação',
        codigo: 'BCC-TESTE'
      }
    });
    cursoId = curso.id;

    // C. Criar Usuário + Aluno
    const tabelaUsuario = (prisma as any).usuario || (prisma as any).users;
    
    const usuarioCriado = await tabelaUsuario.create({
      data: {
        nome: 'Aluno Teste',
        email: 'aluno@teste.com',
        senha: 'hash_senha_123',
        aluno: {
          create: {
            matricula: '2024001',
            cursoId: cursoId,
            tipoAcesso: 'ACESSO_BOLSISTA' // Enum correto verificado no schema
          }
        }
      }
    });
    alunoId = usuarioCriado.id;

    // Gera token com 'sub' preenchido
    tokenAluno = `Bearer ${gerarToken(alunoId, 'student')}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/avaliacao-tutoria - Deve criar uma avaliação com sucesso (201)', async () => {
    const payload = {
      periodoId: periodoId,
      tipoAvaliador: 'ALUNO',
      comentarioGeral: 'Integração funcionando perfeitamente!',
      aspectosPositivos: ['API Rápida', 'Bem estruturada'],
      aspectosNegativos: [],
      sugestoesMelhorias: [],
      dificuldadesComunicacao: 'Nenhuma',
      dificuldadesConteudo: 'Nenhuma',
      dificuldadesMetodologicas: 'Nenhuma',
      dificuldadesRecursos: 'Nenhuma',
      nivelSatisfacaoGeral: 'MUITO_SATISFEITO',
      recomendariaPrograma: true,
      justificativaRecomendacao: 'Sim'
    };

    const response = await request(app)
      .post('/api/avaliacao-tutoria')
      .set('Authorization', tokenAluno)
      .send(payload);

    // Se der erro, mostra o que o backend respondeu para ajudar a debugar
    if (response.status !== 201) {
      console.error('Erro retornado pela API:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    
    // Confirmação no banco
    const salvoNoBanco = await prisma.avaliacaoTutoria.findFirst({
      where: { usuarioId: alunoId }
    });
    expect(salvoNoBanco).toBeTruthy();
  });

  it('POST /api/avaliacao-tutoria - Não deve permitir acesso sem token (401)', async () => {
    const response = await request(app)
      .post('/api/avaliacao-tutoria')
      .send({});

    expect(response.status).toBe(401);
  });
});