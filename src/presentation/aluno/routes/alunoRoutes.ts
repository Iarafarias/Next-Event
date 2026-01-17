import { Router, Request, Response } from 'express';
import { param, body, query } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { PostgresAlunoRepository } from '../../../infrastructure/aluno/repositories/PostgresAlunoRepository';
import { ListAlunosUseCase } from '../../../application/aluno/use-cases/ListAlunosUseCase';
import { GetAlunoByIdUseCase } from '../../../application/aluno/use-cases/GetAlunoByIdUseCase';
import { UpdateAlunoUseCase } from '../../../application/aluno/use-cases/UpdateAlunoUseCase';
import { AlunoController } from '../controllers/AlunoController';
import logger from '../../../infrastructure/logger/logger';

const alunoRoutes = Router();

// Instanciar repositório
const alunoRepository = new PostgresAlunoRepository();

// Instanciar use cases
const listAlunosUseCase = new ListAlunosUseCase(alunoRepository);
const getAlunoByIdUseCase = new GetAlunoByIdUseCase(alunoRepository);
const updateAlunoUseCase = new UpdateAlunoUseCase(alunoRepository);

// Instanciar controller
const alunoController = new AlunoController(
    listAlunosUseCase,
    getAlunoByIdUseCase,
    updateAlunoUseCase
);

// Rotas
// GET /api/alunos - Listar alunos (requer coordinator, tutor ou scholarship_holder)
alunoRoutes.get(
    '/',
    authMiddleware,
    authorizeRoles(['coordinator', 'tutor', 'scholarship_holder']),
    [
        query('cursoId').optional().isString(),
        query('role').optional().isIn(['ALUNO', 'TUTOR', 'BOLSISTA', 'TUTOR_BOLSISTA']),
        validationMiddleware
    ],
    (req: Request, res: Response) => {
        logger.info('GET /api/alunos - Listar alunos', { user: req.user, query: req.query });
        alunoController.list(req, res);
    }
);

// GET /api/alunos/:id - Buscar aluno por ID (requer autenticação)
alunoRoutes.get(
    '/:id',
    authMiddleware,
    [param('id').isString().notEmpty(), validationMiddleware],
    (req: Request, res: Response) => {
        logger.info('GET /api/alunos/:id - Buscar aluno', { user: req.user, params: req.params });
        alunoController.getById(req, res);
    }
);

// PUT /api/alunos/:id - Atualizar aluno (requer coordinator ou scholarship_holder)
alunoRoutes.put(
    '/:id',
    authMiddleware,
    authorizeRoles(['coordinator', 'scholarship_holder']),
    [
        param('id').isString().notEmpty(),
        body('cursoId').optional().isString(),
        body('matricula').optional().isString(),
        validationMiddleware
    ],
    (req: Request, res: Response) => {
        logger.info('PUT /api/alunos/:id - Atualizar aluno', { user: req.user, params: req.params, body: req.body });
        alunoController.update(req, res);
    }
);

export { alunoRoutes };
