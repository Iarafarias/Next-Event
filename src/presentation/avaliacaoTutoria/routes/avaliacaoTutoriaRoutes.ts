import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { AvaliacaoTutoriaController } from '../controllers/AvaliacaoTutoriaController';
import { CreateAvaliacaoTutoriaUseCase } from '../../../application/avaliacaoTutoria/use-cases/CreateAvaliacaoTutoriaUseCase';
import { ListAvaliacoesTutoriaUseCase } from '../../../application/avaliacaoTutoria/use-cases/ListAvaliacoesTutoriaUseCase';
import { UpdateAvaliacaoTutoriaUseCase } from '../../../application/avaliacaoTutoria/use-cases/UpdateAvaliacaoTutoriaUseCase';
import { PostgresAvaliacaoTutoriaRepository } from '../../../infrastructure/avaliacaoTutoria/repositories/PostgresAvaliacaoTutoriaRepository';

// Repository
const avaliacaoTutoriaRepository = new PostgresAvaliacaoTutoriaRepository();

// Use Cases
const createAvaliacaoTutoriaUseCase = new CreateAvaliacaoTutoriaUseCase(avaliacaoTutoriaRepository);
const listAvaliacoesTutoriaUseCase = new ListAvaliacoesTutoriaUseCase(avaliacaoTutoriaRepository);
const updateAvaliacaoTutoriaUseCase = new UpdateAvaliacaoTutoriaUseCase(avaliacaoTutoriaRepository);

// Controller
const avaliacaoTutoriaController = new AvaliacaoTutoriaController(
  createAvaliacaoTutoriaUseCase,
  listAvaliacoesTutoriaUseCase,
  updateAvaliacaoTutoriaUseCase
);

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /api/avaliacao-tutoria - Criar avaliação (tutores e alunos/bolsistas)
router.post('/', authMiddleware, authorizeRoles(['tutor', 'student', 'scholarship_holder']), (req, res) =>
  avaliacaoTutoriaController.create(req, res)
);

// GET /api/avaliacao-tutoria/minhas - Usuário listar suas próprias avaliações
router.get('/minhas', authMiddleware, authorizeRoles(['tutor', 'student', 'scholarship_holder']), (req, res) =>
  avaliacaoTutoriaController.listMyAvaliacoes(req, res)
);

// GET /api/avaliacao-tutoria - Coordenadores listam todas as avaliações com filtros
router.get('/', authMiddleware, authorizeRoles(['coordinator']), (req, res) =>
  avaliacaoTutoriaController.list(req, res)
);

// PUT /api/avaliacao-tutoria/:id - Atualizar avaliação (apenas o próprio autor)
router.put('/:id', authMiddleware, authorizeRoles(['tutor', 'student', 'scholarship_holder']), (req, res) =>
  avaliacaoTutoriaController.update(req, res)
);

export default router;
