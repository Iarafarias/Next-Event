import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { CursoController } from '../controllers/CursoController';
import { CreateCursoUseCase } from '../../../application/curso/use-cases/CreateCursoUseCase';
import { ListCursosUseCase } from '../../../application/curso/use-cases/ListCursosUseCase';
import { PostgresCursoRepository } from '../../../infrastructure/curso/repositories/PostgresCursoRepository';

// Repository
const cursoRepository = new PostgresCursoRepository();

// Use Cases
const createCursoUseCase = new CreateCursoUseCase(cursoRepository);
const listCursosUseCase = new ListCursosUseCase(cursoRepository);

// Controller
const cursoController = new CursoController(
  createCursoUseCase,
  listCursosUseCase
);

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /api/cursos - Criar curso (só coordenadores)
router.post('/', authMiddleware, authorizeRoles(['coordinator']), (req, res) => 
  cursoController.create(req, res)
);

// GET /api/cursos - Listar cursos (todos os usuários autenticados)
router.get('/', (req, res) => 
  cursoController.list(req, res)
);

export default router;