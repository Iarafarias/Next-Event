import { Router } from 'express';
import { GenerateRelatorioConsolidadoUseCase } from '../../../application/relatorio/use-cases/GenerateRelatorioConsolidadoUseCase';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { Request, Response } from 'express';
import logger from '../../../infrastructure/logger/logger';

export default function createRelatorioConsolidadoRoutes(
  generateRelatorioConsolidadoUseCase: GenerateRelatorioConsolidadoUseCase
): Router {
  const router = Router();

  // Aplicar middleware de autenticação para todas as rotas
  router.use(authMiddleware);
  
  // TODO: Implementar middleware de autorização para coordinator e bolsista quando disponível

  /**
   * @swagger
   * /relatorios/consolidado:
   *   post:
   *     summary: Gerar relatório consolidado
   *     description: Gera um relatório consolidado com estatísticas do sistema de tutoria
   *     tags: [Relatórios]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               periodoId:
   *                 type: string
   *                 description: ID do período específico para análise (opcional)
   *               dataInicio:
   *                 type: string
   *                 format: date
   *                 description: Data de início para análise (opcional)
   *               dataFim:
   *                 type: string
   *                 format: date
   *                 description: Data de fim para análise (opcional)
   *               incluirDetalhes:
   *                 type: boolean
   *                 description: Se deve incluir detalhes no relatório (padrão false)
   *             example:
   *               periodoId: "uuid-periodo"
   *               dataInicio: "2024-01-01"
   *               dataFim: "2024-12-31"
   *               incluirDetalhes: true
   *     responses:
   *       200:
   *         description: Relatório consolidado gerado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/RelatorioConsolidadoDTO'
   *       400:
   *         description: Parâmetros inválidos
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão para gerar relatórios
   *       500:
   *         description: Erro interno do servidor
   */
  router.post('/consolidado', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { periodoId, dataInicio, dataFim, incluirDetalhes } = req.body;
      
      logger.info('POST /relatorios/consolidado - Gerar relatório consolidado', {
        userId,
        periodoId,
        dataInicio,
        dataFim,
        incluirDetalhes
      });

      const relatorio = await generateRelatorioConsolidadoUseCase.execute({
        periodoId,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
        incluirDetalhes: incluirDetalhes || false
      }, userId);

      return res.status(200).json({
        message: 'Relatório consolidado gerado com sucesso',
        data: relatorio
      });
    } catch (error: any) {
      logger.error('Erro ao gerar relatório consolidado', { 
        error: error.message,
        userId: (req as any).user?.userId 
      });
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: 'Não foi possível gerar o relatório consolidado'
      });
    }
  });

  /**
   * @swagger
   * /relatorios/template:
   *   get:
   *     summary: Obter template do relatório consolidado
   *     description: Retorna a estrutura do template usado para gerar relatórios consolidados
   *     tags: [Relatórios]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Template do relatório retornado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   description: Estrutura do template
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão para acessar templates
   *       500:
   *         description: Erro interno do servidor
   */
  router.get('/template', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      
      logger.info('GET /relatorios/template - Obter template do relatório', {
        userId
      });

      const template = {
        estrutura: {
          periodo: {
            descricao: "Informações do período analisado",
            campos: ["id", "nome", "dataInicio", "dataFim"]
          },
          estatisticas: {
            descricao: "Números gerais do sistema",
            campos: [
              "totalAlunos",
              "totalTutores", 
              "totalFormulariosAcompanhamento",
              "totalAvaliacoesTutoria",
              "totalCertificadosPendentes",
              "totalCertificadosAprovados",
              "totalCertificadosRejeitados"
            ]
          },
          distribuicaoSatisfacao: {
            descricao: "Distribuição dos níveis de satisfação",
            campos: [
              "muitoInsatisfeito",
              "insatisfeito", 
              "neutro",
              "satisfeito",
              "muitoSatisfeito"
            ]
          },
          principaisDificuldades: {
            descricao: "Principais dificuldades identificadas",
            campos: [
              "comunicacao",
              "conteudo",
              "metodologicas",
              "recursos",
              "outras"
            ]
          },
          alunosPorTutor: {
            descricao: "Distribuição de alunos por tutor",
            campos: ["tutorNome", "tutorEmail", "quantidadeAlunos", "avaliacaoMedia"]
          },
          certificadosPorCategoria: {
            descricao: "Distribuição de certificados por categoria",
            campos: ["categoria", "total", "aprovados", "pendentes", "rejeitados"]
          },
          formsAcompanhamentoPorMes: {
            descricao: "Distribuição de formulários por mês",
            campos: ["mes", "quantidade"]
          }
        },
        metadados: {
          versao: "1.0",
          formatosSuportados: ["JSON"],
          observacoes: "Template para relatório consolidado do sistema de tutoria"
        }
      };

      return res.status(200).json({
        message: 'Template do relatório consolidado retornado com sucesso',
        data: template
      });
    } catch (error: any) {
      logger.error('Erro ao obter template do relatório', { 
        error: error.message,
        userId: (req as any).user?.userId 
      });
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: 'Não foi possível obter o template do relatório'
      });
    }
  });

  return router;
}