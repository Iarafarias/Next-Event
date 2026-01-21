import { Router } from 'express';
import { BolsistaController } from '../../user/controllers/BolsistaController';
import { authMiddleware } from '../../middlewares/authMiddleware';

export default function createBolsistaRoutes(bolsistaController: BolsistaController): Router {
  const router = Router();

  // Aplicar middleware de autenticação para todas as rotas
  router.use(authMiddleware);
  
  // TODO: Implementar verificação de role bolsista quando middleware estiver disponível

  /**
   * @swagger
   * /bolsistas/dashboard:
   *   get:
   *     summary: Obter dados do dashboard para bolsista
   *     description: Retorna dados consolidados para visualização no dashboard do bolsista
   *     tags: [Bolsista]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados do dashboard carregados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/BolsistaDataView'
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão de bolsista
   *       500:
   *         description: Erro interno do servidor
   */
  router.get('/dashboard', bolsistaController.getDashboardData.bind(bolsistaController));

  /**
   * @swagger
   * /bolsistas/alunos:
   *   get:
   *     summary: Visualizar registros de alunos
   *     description: Retorna lista de alunos com estatísticas para visualização do bolsista
   *     tags: [Bolsista]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Registros de alunos carregados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   description: Dados dos alunos com estatísticas
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão de bolsista
   *       500:
   *         description: Erro interno do servidor
   */
  router.get('/alunos', bolsistaController.getAlunos.bind(bolsistaController));

  /**
   * @swagger
   * /bolsistas/tutores:
   *   get:
   *     summary: Visualizar registros de tutores
   *     description: Retorna dados dos tutores com informações de alocação
   *     tags: [Bolsista]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Registros de tutores carregados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   description: Dados dos tutores
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão de bolsista
   *       500:
   *         description: Erro interno do servidor
   */
  router.get('/tutores', bolsistaController.getTutores.bind(bolsistaController));

  /**
   * @swagger
   * /bolsistas/certificados:
   *   get:
   *     summary: Visualizar dados de certificados
   *     description: Retorna estatísticas e dados dos certificados
   *     tags: [Bolsista]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados de certificados carregados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   description: Dados dos certificados
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão de bolsista
   *       500:
   *         description: Erro interno do servidor
   */
  router.get('/certificados', bolsistaController.getCertificados.bind(bolsistaController));

  /**
   * @swagger
   * /bolsistas/forms-acompanhamento:
   *   get:
   *     summary: Visualizar formulários de acompanhamento
   *     description: Retorna dados dos formulários de acompanhamento
   *     tags: [Bolsista]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados de formulários carregados com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   description: Dados dos formulários
   *       401:
   *         description: Token de autenticação inválido
   *       403:
   *         description: Usuário não tem permissão de bolsista
   *       500:
   *         description: Erro interno do servidor
   */
  router.get('/forms-acompanhamento', bolsistaController.getFormsAcompanhamento.bind(bolsistaController));

  /**
   * @swagger
   * /bolsistas/relatorio-consolidado:
   *   post:
   *     summary: Gerar relatório consolidado
   *     description: Gera um relatório consolidado com estatísticas do sistema
   *     tags: [Bolsista]
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
   *                 description: ID do período específico (opcional)
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
   *                 description: Se deve incluir detalhes no relatório
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
   *         description: Usuário não tem permissão de bolsista
   *       500:
   *         description: Erro interno do servidor
   */
  router.post('/relatorio-consolidado', bolsistaController.generateRelatorioConsolidado.bind(bolsistaController));

  return router;
}