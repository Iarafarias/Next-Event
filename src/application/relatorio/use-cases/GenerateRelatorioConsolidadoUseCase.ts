import { RelatorioConsolidadoDTO, GenerateRelatorioConsolidadoRequest } from '../dtos/RelatorioConsolidadoDTO';
import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';
import { IAvaliacaoTutoriaRepository } from '../../../domain/avaliacaoTutoria/repositories/IAvaliacaoTutoriaRepository';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { ITutorRepository } from '../../../domain/user/repositories/ITutorRepository';
import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import logger from '../../../infrastructure/logger/logger';

export class GenerateRelatorioConsolidadoUseCase {
  constructor(
    private relatorioRepository: IRelatorioRepository,
    private avaliacaoTutoriaRepository: IAvaliacaoTutoriaRepository,
    private formAcompanhamentoRepository: IFormAcompanhamentoRepository,
    private certificateRepository: ICertificateRepository,
    private tutorRepository: ITutorRepository,
    private alunoRepository: IAlunoRepository
  ) {}

  async execute(request: GenerateRelatorioConsolidadoRequest, geradorId: string): Promise<RelatorioConsolidadoDTO> {
    try {
      logger.info('Gerando relatório consolidado', {
        request,
        geradorId
      });

      // Definir período de análise
      const dataInicio = request.dataInicio || new Date(new Date().getFullYear(), 0, 1); // Janeiro do ano atual
      const dataFim = request.dataFim || new Date();

      // Buscar dados base
      const [alunos, avaliacoes, forms, certificados] = await Promise.all([
        this.alunoRepository.findAll(),
        this.avaliacaoTutoriaRepository.findAll(),
        this.formAcompanhamentoRepository.list(),
        this.certificateRepository.findAll()
      ]);

      // Filtrar por período se especificado
      const avaliacoesPeriodo = request.periodoId 
        ? avaliacoes.filter((av: any) => av.periodoId === request.periodoId)
        : avaliacoes.filter((av: any) => 
            av.dataEnvio >= dataInicio && av.dataEnvio <= dataFim
          );

      const formsPeriodo = request.periodoId
        ? forms.filter((f: any) => f.periodoId === request.periodoId)
        : forms.filter((f: any) => 
            f.dataEnvio >= dataInicio && f.dataEnvio <= dataFim
          );

      const certificadosPeriodo = certificados.filter((c: any) => 
        c.createdAt >= dataInicio && c.createdAt <= dataFim
      );

      // Calcular estatísticas
      const estatisticas = {
        totalAlunos: alunos.length,
        totalTutores: await this.contarTutoresAtivos(),
        totalFormulariosAcompanhamento: formsPeriodo.length,
        totalAvaliacoesTutoria: avaliacoesPeriodo.length,
        totalCertificadosPendentes: certificadosPeriodo.filter((c: any) => c.status === 'pending').length,
        totalCertificadosAprovados: certificadosPeriodo.filter((c: any) => c.status === 'approved').length,
        totalCertificadosRejeitados: certificadosPeriodo.filter((c: any) => c.status === 'rejected').length
      };

      // Distribuição de satisfação
      const distribuicaoSatisfacao = this.calcularDistribuicaoSatisfacao(avaliacoesPeriodo);

      // Principais dificuldades
      const principaisDificuldades = this.calcularPrincipaisDificuldades(formsPeriodo);

      // Alunos por tutor
      const alunosPorTutor = await this.calcularAlunosPorTutor();

      // Certificados por categoria
      const certificadosPorCategoria = this.calcularCertificadosPorCategoria(certificadosPeriodo);

      // Forms por mês
      const formsAcompanhamentoPorMes = this.calcularFormsPorMes(formsPeriodo);

      const relatorioConsolidado: RelatorioConsolidadoDTO = {
        periodo: request.periodoId ? await this.buscarPeriodo(request.periodoId) : {
          id: 'custom',
          nome: `Período: ${dataInicio.toLocaleDateString()} - ${dataFim.toLocaleDateString()}`,
          dataInicio,
          dataFim
        },
        estatisticas,
        distribuicaoSatisfacao,
        principaisDificuldades,
        alunosPorTutor,
        certificadosPorCategoria,
        formsAcompanhamentoPorMes,
        geradoEm: new Date(),
        geradoPor: geradorId
      };

      logger.info('Relatório consolidado gerado com sucesso', {
        estatisticas,
        geradorId
      });

      return relatorioConsolidado;
    } catch (error: any) {
      logger.error('Erro ao gerar relatório consolidado', {
        error: error.message,
        request,
        geradorId
      });
      throw error;
    }
  }

  private calcularDistribuicaoSatisfacao(avaliacoes: any[]): RelatorioConsolidadoDTO['distribuicaoSatisfacao'] {
    const distribuicao = {
      muitoInsatisfeito: 0,
      insatisfeito: 0,
      neutro: 0,
      satisfeito: 0,
      muitoSatisfeito: 0
    };

    avaliacoes.forEach(av => {
      const nivel = av.conteudo?.nivelSatisfacaoGeral;
      switch (nivel) {
        case 'MUITO_INSATISFEITO': distribuicao.muitoInsatisfeito++; break;
        case 'INSATISFEITO': distribuicao.insatisfeito++; break;
        case 'NEUTRO': distribuicao.neutro++; break;
        case 'SATISFEITO': distribuicao.satisfeito++; break;
        case 'MUITO_SATISFEITO': distribuicao.muitoSatisfeito++; break;
      }
    });

    return distribuicao;
  }

  private calcularPrincipaisDificuldades(forms: any[]): RelatorioConsolidadoDTO['principaisDificuldades'] {
    const dificuldades = {
      comunicacao: 0,
      conteudo: 0,
      metodologicas: 0,
      recursos: 0,
      outras: 0
    };

    forms.forEach(form => {
      const conteudo = form.conteudo;
      if (conteudo?.dificuldadesComunicacao) dificuldades.comunicacao++;
      if (conteudo?.dificuldadesConteudo) dificuldades.conteudo++;
      if (conteudo?.dificuldadesMetodologicas) dificuldades.metodologicas++;
      if (conteudo?.dificuldadesRecursos) dificuldades.recursos++;
      if (conteudo?.outrasDificuldades) dificuldades.outras++;
    });

    return dificuldades;
  }

  private async calcularAlunosPorTutor(): Promise<RelatorioConsolidadoDTO['alunosPorTutor']> {
    // Esta implementação seria específica do repository
    // Por simplicidade, retornando array vazio
    return [];
  }

  private calcularCertificadosPorCategoria(certificados: any[]): RelatorioConsolidadoDTO['certificadosPorCategoria'] {
    const categorias = new Map();

    certificados.forEach(cert => {
      const categoria = cert.category || 'Outros';
      if (!categorias.has(categoria)) {
        categorias.set(categoria, {
          categoria,
          total: 0,
          aprovados: 0,
          pendentes: 0,
          rejeitados: 0
        });
      }

      const cat = categorias.get(categoria);
      cat.total++;
      switch (cert.status) {
        case 'approved': cat.aprovados++; break;
        case 'pending': cat.pendentes++; break;
        case 'rejected': cat.rejeitados++; break;
      }
    });

    return Array.from(categorias.values());
  }

  private calcularFormsPorMes(forms: any[]): RelatorioConsolidadoDTO['formsAcompanhamentoPorMes'] {
    const porMes = new Map();

    forms.forEach(form => {
      const mes = form.dataEnvio.toISOString().substring(0, 7); // YYYY-MM
      porMes.set(mes, (porMes.get(mes) || 0) + 1);
    });

    return Array.from(porMes.entries()).map(([mes, quantidade]) => ({
      mes,
      quantidade
    })).sort((a, b) => a.mes.localeCompare(b.mes));
  }

  private async contarTutoresAtivos(): Promise<number> {
    // Implementação específica para contar tutores ativos
    return 0;
  }

  private async buscarPeriodo(periodoId: string): Promise<RelatorioConsolidadoDTO['periodo']> {
    // Implementação para buscar período
    return {
      id: periodoId,
      nome: 'Período não encontrado',
      dataInicio: new Date(),
      dataFim: new Date()
    };
  }
}
