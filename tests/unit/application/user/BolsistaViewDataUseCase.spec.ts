import { BolsistaViewDataUseCase } from '../../../../src/application/user/use-cases/BolsistaViewDataUseCase';
import { MockFactory, TestDataBuilder } from '../../../helpers/TestDataBuilder';
import { beforeEach, describe, expect, jest, it } from '@jest/globals';

describe('BolsistaViewDataUseCase Unit Tests', () => {
  let useCase: BolsistaViewDataUseCase;
  let mockAlunoRepository: any;
  let mockTutorRepository: any;
  let mockCertificateRepository: any;
  let mockFormAcompanhamentoRepository: any;

  beforeEach(() => {
    mockAlunoRepository = MockFactory.createAlunoRepositoryMock();
    mockTutorRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      listMyAlunos: jest.fn(),
      listAlunos: jest.fn(),
    };
    mockCertificateRepository = MockFactory.createCertificateRepositoryMock();
    mockFormAcompanhamentoRepository = MockFactory.createFormAcompanhamentoRepositoryMock();

    useCase = new BolsistaViewDataUseCase(
      mockAlunoRepository,
      mockTutorRepository,
      mockCertificateRepository,
      mockFormAcompanhamentoRepository
    );
  });

  describe('execute', () => {
    it('deve retornar dados consolidados do dashboard para bolsista', async () => {
      const bolsistaId = 'bolsista-123';

      const alunos = [
        TestDataBuilder.createAluno({ tipoAcesso: 'ACESSO_TUTOR' }),
        TestDataBuilder.createAluno({ tipoAcesso: 'ACESSO_BOLSISTA' }),
      ];

      const forms = [
        TestDataBuilder.createFormAcompanhamentoData(),
        TestDataBuilder.createFormAcompanhamentoData(),
      ];

      const certificados = [
        TestDataBuilder.createCertificateData({ status: 'pending' }),
        TestDataBuilder.createCertificateData({ status: 'approved' }),
        TestDataBuilder.createCertificateData({ status: 'rejected' }),
      ];

      mockAlunoRepository.findAll.mockResolvedValue(alunos);
      mockFormAcompanhamentoRepository.list.mockResolvedValue(forms);
      mockCertificateRepository.findAll.mockResolvedValue(certificados);

      const result = await useCase.execute(bolsistaId);

      expect(result).toBeDefined();
      expect(result.alunos).toBeDefined();
      expect(result.alunos.total).toBe(2);
      expect(result.alunos.registros).toHaveLength(2);

      expect(result.certificados).toBeDefined();
      expect(result.certificados.totalPendentes).toBe(1);
      expect(result.certificados.totalAprovados).toBe(1);
      expect(result.certificados.totalRejeitados).toBe(1);

      expect(result.formsAcompanhamento).toBeDefined();
      expect(result.formsAcompanhamento.pendentesRevisao).toHaveLength(2);

      expect(result.estatisticasGerais).toBeDefined();
      expect(typeof result.estatisticasGerais.taxaAprovacaoCertificados).toBe('number');
    });

    it('deve processar corretamente dados de alunos por curso', async () => {
      const bolsistaId = 'bolsista-123';

      const alunos = [
        {
          id: 'aluno-1',
          tipoAcesso: 'ACESSO_TUTOR',
          ativo: true,
          criadoEm: new Date(),
          curso: { nome: 'Engenharia' },
          usuario: { nome: 'João Silva', email: 'joao@email.com' },
          matricula: '2024001',
        },
        {
          id: 'aluno-2',
          tipoAcesso: 'ACESSO_BOLSISTA',
          ativo: true,
          criadoEm: new Date(),
          curso: { nome: 'Engenharia' },
          usuario: { nome: 'Maria Santos', email: 'maria@email.com' },
          matricula: '2024002',
        },
        {
          id: 'aluno-3',
          tipoAcesso: 'ACESSO_TUTOR',
          ativo: true,
          criadoEm: new Date(),
          curso: { nome: 'Administração' },
          usuario: { nome: 'Pedro Oliveira', email: 'pedro@email.com' },
          matricula: '2024003',
        },
      ];

      mockAlunoRepository.findAll.mockResolvedValue(alunos);
      mockFormAcompanhamentoRepository.list.mockResolvedValue([]);
      mockCertificateRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute(bolsistaId);

      expect(result.alunos.porCurso).toEqual([
        { curso: 'Engenharia', quantidade: 2 },
        { curso: 'Administração', quantidade: 1 },
      ]);

      expect(result.alunos.porTipo).toEqual([
        { tipo: 'ACESSO_TUTOR', quantidade: 2 },
        { tipo: 'ACESSO_BOLSISTA', quantidade: 1 },
      ]);
    });

    it('deve calcular estatísticas gerais corretamente', async () => {
      const bolsistaId = 'bolsista-123';

      const alunos = [TestDataBuilder.createAluno()];
      const forms = [
        { ...TestDataBuilder.createFormAcompanhamentoData(), conteudo: { quantidadeReunioes: 3 } },
        { ...TestDataBuilder.createFormAcompanhamentoData(), conteudo: { quantidadeReunioes: 5 } },
      ];
      const certificados = [
        TestDataBuilder.createCertificateData({ status: 'approved' }),
        TestDataBuilder.createCertificateData({ status: 'approved' }),
        TestDataBuilder.createCertificateData({ status: 'rejected' }),
      ];

      mockAlunoRepository.findAll.mockResolvedValue(alunos);
      mockFormAcompanhamentoRepository.list.mockResolvedValue(forms);
      mockCertificateRepository.findAll.mockResolvedValue(certificados);

      const result = await useCase.execute(bolsistaId);

      expect(result.estatisticasGerais.taxaAprovacaoCertificados).toBe(66.67);
      expect(result.estatisticasGerais.mediaReunioesPorForm).toBe(4);
    });

    it('deve tratar erro quando repositório falha', async () => {
      const bolsistaId = 'bolsista-123';
      mockAlunoRepository.findAll.mockRejectedValue(new Error('Erro de banco'));

      await expect(useCase.execute(bolsistaId)).rejects.toThrow('Erro de banco');
    });
  });
});
