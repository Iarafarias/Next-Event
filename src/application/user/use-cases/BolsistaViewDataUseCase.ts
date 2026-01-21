import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { ITutorRepository } from '../../../domain/user/repositories/ITutorRepository';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import logger from '../../../infrastructure/logger/logger';

export interface BolsistaDataView {
  alunos: {
    total: number;
    porCurso: {
      curso: string;
      quantidade: number;
    }[];
    porTipo: {
      tipo: string;
      quantidade: number;
    }[];
    registros: {
      id: string;
      nome: string;
      email: string;
      matricula: string;
      curso: string;
      tipoAcesso: string;
      ativo: boolean;
      dataIngresso: Date;
    }[];
  };
  tutores: {
    total: number;
    capacidadeTotal: number;
    alocacoes: {
      id: string;
      nome: string;
      email: string;
      alunosAtivos: number;
      capacidadeMaxima: number;
      percentualOcupacao: number;
    }[];
  };
  certificados: {
    totalPendentes: number;
    totalAprovados: number;
    totalRejeitados: number;
    recentesPendentes: {
      id: string;
      titulo: string;
      aluno: string;
      dataEnvio: Date;
      categoria: string;
    }[];
  };
  formsAcompanhamento: {
    totalMes: number;
    pendentesRevisao: {
      id: string;
      tutor: string;
      aluno: string;
      dataEnvio: Date;
      modalidade: string;
    }[];
  };
  estatisticasGerais: {
    taxaAprovacaoCertificados: number;
    mediaReunioesPorForm: number;
    cursosComMaisAlunos: {
      curso: string;
      quantidade: number;
    }[];
  };
}

export class BolsistaViewDataUseCase {
  constructor(
    private alunoRepository: IAlunoRepository,
    private tutorRepository: ITutorRepository,
    private certificateRepository: ICertificateRepository,
    private formAcompanhamentoRepository: IFormAcompanhamentoRepository
  ) {}

  async execute(bolsistaId: string): Promise<BolsistaDataView> {
    try {
      logger.info('Buscando dados para visualização do bolsista', { bolsistaId });

      // Buscar dados base
      const [alunos, forms, certificados] = await Promise.all([
        this.alunoRepository.findAll(),
        this.formAcompanhamentoRepository.list(),
        this.certificateRepository.findAll()
      ]);

      // Processar dados de alunos
      const dadosAlunos = this.processarDadosAlunos(alunos);

      // Processar dados de tutores
      const dadosTutores = await this.processarDadosTutores();

      // Processar dados de certificados
      const dadosCertificados = this.processarDadosCertificados(certificados);

      // Processar dados de formulários
      const dadosFormularios = this.processarDadosFormularios(forms);

      // Calcular estatísticas gerais
      const estatisticasGerais = this.calcularEstatisticasGerais(alunos, certificados, forms);

      const dataView: BolsistaDataView = {
        alunos: dadosAlunos,
        tutores: dadosTutores,
        certificados: dadosCertificados,
        formsAcompanhamento: dadosFormularios,
        estatisticasGerais
      };

      logger.info('Dados para visualização do bolsista processados', {
        bolsistaId,
        totalAlunos: dadosAlunos.total,
        totalTutores: dadosTutores.total,
        totalCertificados: dadosCertificados.totalPendentes + dadosCertificados.totalAprovados + dadosCertificados.totalRejeitados
      });

      return dataView;
    } catch (error: any) {
      logger.error('Erro ao buscar dados para visualização do bolsista', {
        error: error.message,
        bolsistaId
      });
      throw error;
    }
  }

  private processarDadosAlunos(alunos: any[]): BolsistaDataView['alunos'] {
    const porCurso = new Map();
    const porTipo = new Map();

    alunos.forEach(aluno => {
      // Por curso
      const curso = aluno.curso?.nome || 'Sem curso';
      porCurso.set(curso, (porCurso.get(curso) || 0) + 1);

      // Por tipo
      porTipo.set(aluno.tipoAcesso, (porTipo.get(aluno.tipoAcesso) || 0) + 1);
    });

    return {
      total: alunos.length,
      porCurso: Array.from(porCurso.entries()).map(([curso, quantidade]) => ({ curso, quantidade })),
      porTipo: Array.from(porTipo.entries()).map(([tipo, quantidade]) => ({ tipo, quantidade })),
      registros: alunos.map(aluno => ({
        id: aluno.id,
        nome: aluno.usuario?.nome || 'Nome não disponível',
        email: aluno.usuario?.email || 'Email não disponível',
        matricula: aluno.matricula,
        curso: aluno.curso?.nome || 'Sem curso',
        tipoAcesso: aluno.tipoAcesso,
        ativo: aluno.ativo,
        dataIngresso: aluno.criadoEm
      }))
    };
  }

  private async processarDadosTutores(): Promise<BolsistaDataView['tutores']> {
    // Por simplicidade, retornando dados mock
    // Em implementação real, buscaria dados dos tutores
    return {
      total: 0,
      capacidadeTotal: 0,
      alocacoes: []
    };
  }

  private processarDadosCertificados(certificados: any[]): BolsistaDataView['certificados'] {
    const agora = new Date();
    const umMesAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

    const pendentes = certificados.filter(c => c.status === 'pending');
    const aprovados = certificados.filter(c => c.status === 'approved');
    const rejeitados = certificados.filter(c => c.status === 'rejected');

    const recentesPendentes = pendentes
      .filter(c => c.createdAt >= umMesAtras)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        titulo: c.title,
        aluno: c.userId, // Seria necessário buscar o nome do aluno
        dataEnvio: c.createdAt,
        categoria: c.category
      }));

    return {
      totalPendentes: pendentes.length,
      totalAprovados: aprovados.length,
      totalRejeitados: rejeitados.length,
      recentesPendentes
    };
  }

  private processarDadosFormularios(forms: any[]): BolsistaDataView['formsAcompanhamento'] {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    const formsMes = forms.filter(f => f.dataEnvio >= inicioMes);

    const pendentesRevisao = forms
      .sort((a, b) => b.dataEnvio.getTime() - a.dataEnvio.getTime())
      .slice(0, 10)
      .map(f => ({
        id: f.id,
        tutor: f.tutor?.usuario?.nome || 'Tutor não identificado',
        aluno: f.bolsista?.usuario?.nome || 'Aluno não identificado',
        dataEnvio: f.dataEnvio,
        modalidade: f.conteudo?.modalidadeReuniao || 'Não informado'
      }));

    return {
      totalMes: formsMes.length,
      pendentesRevisao
    };
  }

  private calcularEstatisticasGerais(alunos: any[], certificados: any[], forms: any[]): BolsistaDataView['estatisticasGerais'] {
    const totalCertificados = certificados.length;
    const aprovados = certificados.filter(c => c.status === 'approved').length;
    const taxaAprovacao = totalCertificados > 0 ? (aprovados / totalCertificados) * 100 : 0;

    // Calcular média de reuniões por formulário
    const totalReunioes = forms.reduce((acc, f) => {
      return acc + (f.conteudo?.quantidadeReunioes || 0);
    }, 0);
    const mediaReunioes = forms.length > 0 ? totalReunioes / forms.length : 0;

    // Cursos com mais alunos
    const alunosPorCurso = new Map();
    alunos.forEach(aluno => {
      const curso = aluno.curso?.nome || 'Sem curso';
      alunosPorCurso.set(curso, (alunosPorCurso.get(curso) || 0) + 1);
    });

    const cursosComMaisAlunos = Array.from(alunosPorCurso.entries())
      .map(([curso, quantidade]) => ({ curso, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      taxaAprovacaoCertificados: Math.round(taxaAprovacao * 100) / 100,
      mediaReunioesPorForm: Math.round(mediaReunioes * 100) / 100,
      cursosComMaisAlunos
    };
  }
}
