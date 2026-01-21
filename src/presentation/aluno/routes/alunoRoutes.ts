import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { AlunoController } from '../controllers/AlunoController';
import { CreateAlunoUseCase } from '../../../application/aluno/use-cases/CreateAlunoUseCase';
import { ListAlunosUseCase } from '../../../application/aluno/use-cases/ListAlunosUseCase';
import { ListAlunosTutoresUseCase } from '../../../application/aluno/use-cases/ListAlunosTutoresUseCase';
import { ListAlunosBolsistasUseCase } from '../../../application/aluno/use-cases/ListAlunosBolsistasUseCase';
import { PostgresAlunoRepository } from '../../../infrastructure/aluno/repositories/PostgresAlunoRepository';
import { PostgresUsuarioRepository } from '../../../infrastructure/user/repositories/postgresUsuarioRepository';
import { PostgresCursoRepository } from '../../../infrastructure/curso/repositories/PostgresCursoRepository';

// Repositories
const alunoRepository = new PostgresAlunoRepository();
const usuarioRepository = new PostgresUsuarioRepository();
const cursoRepository = new PostgresCursoRepository();

// Use Cases
const createAlunoUseCase = new CreateAlunoUseCase(alunoRepository, usuarioRepository, cursoRepository);
const listAlunosUseCase = new ListAlunosUseCase(alunoRepository);
const listAlunosTutoresUseCase = new ListAlunosTutoresUseCase(alunoRepository);
const listAlunosBolsistasUseCase = new ListAlunosBolsistasUseCase(alunoRepository);

// Controller
const alunoController = new AlunoController(
  createAlunoUseCase,
  listAlunosUseCase,
  listAlunosTutoresUseCase,
  listAlunosBolsistasUseCase
);

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /api/alunos - Criar aluno (só coordenadores)
router.post('/', authMiddleware, authorizeRoles(['coordinator']), (req, res) => 
  alunoController.create(req, res)
);

// GET /api/alunos - Listar todos os alunos (coordenadores e tutores)
router.get('/', authMiddleware, authorizeRoles(['coordinator', 'tutor']), (req, res) => 
  alunoController.list(req, res)
);

// GET /api/alunos/tutores - Listar alunos tutores (coordenadores e tutores)
router.get('/tutores', authMiddleware, authorizeRoles(['coordinator', 'tutor']), (req, res) => 
  alunoController.listTutores(req, res)
);

// GET /api/alunos/bolsistas - Listar alunos bolsistas (coordenadores e tutores)
router.get('/bolsistas', authMiddleware, authorizeRoles(['coordinator', 'tutor']), (req, res) => 
  alunoController.listBolsistas(req, res)
);

export default router;