import { Request, Response } from 'express';
import { BolsistaViewDataUseCase } from '../../../application/user/use-cases/BolsistaViewDataUseCase';
import { GenerateRelatorioConsolidadoUseCase } from '../../../application/relatorio/use-cases/GenerateRelatorioConsolidadoUseCase';
import logger from '../../../infrastructure/logger/logger';

export class BolsistaController {
  constructor(
    private bolsistaViewDataUseCase: BolsistaViewDataUseCase,
    private generateRelatorioConsolidadoUseCase: GenerateRelatorioConsolidadoUseCase
  ) {}

  async getDashboardData(req: Request, res: Response): Promise<Response> {
    try {
      const bolsistaId = (req as any).user.userId;
      
      logger.info('GET /bolsistas/dashboard - Buscar dados do dashboard', {
        bolsistaId
      });

      const dashboardData = await this.bolsistaViewDataUseCase.execute(bolsistaId);

      return res.json({
        message: 'Dados do dashboard carregados com sucesso',
        data: dashboardData
      });
    } catch (error: any) {
      logger.error('Erro ao carregar dados do dashboard', { 
        error: error.message,
        bolsistaId: (req as any).user?.userId 
      });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAlunos(req: Request, res: Response): Promise<Response> {
    try {
      const bolsistaId = (req as any).user.userId;
      
      logger.info('GET /bolsistas/alunos - Visualizar registros de alunos', {
        bolsistaId
      });

      const dashboardData = await this.bolsistaViewDataUseCase.execute(bolsistaId);

      return res.json({
        message: 'Registros de alunos carregados com sucesso',
        data: dashboardData.alunos,
        estatisticas: {
          total: dashboardData.alunos.total,
          porCurso: dashboardData.alunos.porCurso,
          porTipo: dashboardData.alunos.porTipo
        }
      });
    } catch (error: any) {
      logger.error('Erro ao carregar registros de alunos', { 
        error: error.message,
        bolsistaId: (req as any).user?.userId 
      });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getTutores(req: Request, res: Response): Promise<Response> {
    try {
      const bolsistaId = (req as any).user.userId;
      
      logger.info('GET /bolsistas/tutores - Visualizar registros de tutores', {
        bolsistaId
      });

      const dashboardData = await this.bolsistaViewDataUseCase.execute(bolsistaId);

      return res.json({
        message: 'Registros de tutores carregados com sucesso',
        data: dashboardData.tutores
      });
    } catch (error: any) {
      logger.error('Erro ao carregar registros de tutores', { 
        error: error.message,
        bolsistaId: (req as any).user?.userId 
      });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async generateRelatorioConsolidado(req: Request, res: Response): Promise<Response> {
    try {
      const bolsistaId = (req as any).user.userId;
      const { periodoId, dataInicio, dataFim, incluirDetalhes } = req.body;
      
      logger.info('POST /bolsistas/relatorio-consolidado - Gerar relatório consolidado', {
        bolsistaId,
        periodoId,
        dataInicio,
        dataFim
      });

      const relatorio = await this.generateRelatorioConsolidadoUseCase.execute({
        periodoId,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
        incluirDetalhes: incluirDetalhes || false
      }, bolsistaId);

      return res.json({
        message: 'Relatório consolidado gerado com sucesso',
        data: relatorio
      });
    } catch (error: any) {
      logger.error('Erro ao gerar relatório consolidado', { 
        error: error.message,
        bolsistaId: (req as any).user?.userId 
      });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getCertificados(req: Request, res: Response): Promise<Response> {
    try {
      const bolsistaId = (req as any).user.userId;
      
      logger.info('GET /bolsistas/certificados - Visualizar certificados', {
        bolsistaId
      });

      const dashboardData = await this.bolsistaViewDataUseCase.execute(bolsistaId);

      return res.json({
        message: 'Dados de certificados carregados com sucesso',
        data: dashboardData.certificados
      });
    } catch (error: any) {
      logger.error('Erro ao carregar dados de certificados', { 
        error: error.message,
        bolsistaId: (req as any).user?.userId 
      });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getFormsAcompanhamento(req: Request, res: Response): Promise<Response> {
    try {
      const bolsistaId = (req as any).user.userId;
      
      logger.info('GET /bolsistas/forms-acompanhamento - Visualizar formulários', {
        bolsistaId
      });

      const dashboardData = await this.bolsistaViewDataUseCase.execute(bolsistaId);

      return res.json({
        message: 'Dados de formulários de acompanhamento carregados com sucesso',
        data: dashboardData.formsAcompanhamento
      });
    } catch (error: any) {
      logger.error('Erro ao carregar formulários de acompanhamento', { 
        error: error.message,
        bolsistaId: (req as any).user?.userId 
      });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
