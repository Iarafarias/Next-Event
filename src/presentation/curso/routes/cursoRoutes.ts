import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { PostgresCursoRepository } from '../../../infrastructure/curso/repositories/PostgresCursoRepository';
import { CreateCursoUseCase } from '../../../application/curso/use-cases/CreateCursoUseCase';
import { ListCursosUseCase } from '../../../application/curso/use-cases/ListCursosUseCase';
import { GetCursoByIdUseCase } from '../../../application/curso/use-cases/GetCursoByIdUseCase';
import { UpdateCursoUseCase } from '../../../application/curso/use-cases/UpdateCursoUseCase';
import { DeleteCursoUseCase } from '../../../application/curso/use-cases/DeleteCursoUseCase';
import { CursoController } from '../controllers/CursoController';
import logger from '../../../infrastructure/logger/logger';

const cursoRoutes = Router();

// Instanciar repositório
const cursoRepository = new PostgresCursoRepository();

// Instanciar use cases
const createCursoUseCase = new CreateCursoUseCase(cursoRepository);
const listCursosUseCase = new ListCursosUseCase(cursoRepository);
const getCursoByIdUseCase = new GetCursoByIdUseCase(cursoRepository);
const updateCursoUseCase = new UpdateCursoUseCase(cursoRepository);
const deleteCursoUseCase = new DeleteCursoUseCase(cursoRepository);

// Instanciar controller
const cursoController = new CursoController(
    createCursoUseCase,
    listCursosUseCase,
    getCursoByIdUseCase,
    updateCursoUseCase,
    deleteCursoUseCase
);

// Rotas
// POST /api/cursos - Criar curso (requer coordinator ou bolsista)
cursoRoutes.post(
    '/',
    authMiddleware,
    authorizeRoles(['coordinator', 'scholarship_holder']),
    [
        body('nome').isString().notEmpty().withMessage('Nome é obrigatório'),
        body('codigo').isString().notEmpty().withMessage('Código é obrigatório'),
        body('descricao').optional().isString(),
        validationMiddleware
    ],
    (req: Request, res: Response) => {
        logger.info('POST /api/cursos - Criar curso', { user: req.user, body: req.body });
        cursoController.create(req, res);
    }
);

// GET /api/cursos - Listar cursos (Público)
cursoRoutes.get(
    '/',
    (req: Request, res: Response) => {
        logger.info('GET /api/cursos - Listar cursos');
        cursoController.list(req, res);
    }
);

// GET /api/cursos/:id - Buscar curso por ID (Público)
cursoRoutes.get(
    '/:id',
    [param('id').isString().notEmpty(), validationMiddleware],
    (req: Request, res: Response) => {
        logger.info('GET /api/cursos/:id - Buscar curso', { params: req.params });
        cursoController.getById(req, res);
    }
);

// PUT /api/cursos/:id - Atualizar curso (requer coordinator ou bolsista)
cursoRoutes.put(
    '/:id',
    authMiddleware,
    authorizeRoles(['coordinator', 'scholarship_holder']),
    [
        param('id').isString().notEmpty(),
        body('nome').optional().isString(),
        body('codigo').optional().isString(),
        body('descricao').optional().isString(),
        validationMiddleware
    ],
    (req: Request, res: Response) => {
        logger.info('PUT /api/cursos/:id - Atualizar curso', { user: req.user, params: req.params, body: req.body });
        cursoController.update(req, res);
    }
);

// DELETE /api/cursos/:id - Deletar curso (requer coordinator)
cursoRoutes.delete(
    '/:id',
    authMiddleware,
    authorizeRoles(['coordinator']),
    [param('id').isString().notEmpty(), validationMiddleware],
    (req: Request, res: Response) => {
        logger.info('DELETE /api/cursos/:id - Deletar curso', { user: req.user, params: req.params });
        cursoController.delete(req, res);
    }
);

export { cursoRoutes };
