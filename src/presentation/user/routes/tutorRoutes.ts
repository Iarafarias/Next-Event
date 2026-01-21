import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { TutorController } from '../controllers/TutorController';
import { ListAlunosByTutorUseCase } from '../../../application/user/use-cases/ListAlunosByTutorUseCase';
import { PostgresTutorRepository } from '../../../infrastructure/user/repositories/PostgresTutorRepository';

// Repositories
const tutorRepository = new PostgresTutorRepository();

// Use Cases
const listAlunosByTutorUseCase = new ListAlunosByTutorUseCase(tutorRepository);

// Controller
const tutorController = new TutorController(listAlunosByTutorUseCase);

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/tutores/meus-alunos - Tutor listar seus próprios alunos
router.get('/meus-alunos', authMiddleware, authorizeRoles(['tutor']), (req, res) => 
  tutorController.listMyAlunos(req, res)
);

// GET /api/tutores/:id/alunos - Coordenador listar alunos de um tutor específico
router.get('/:id/alunos', authMiddleware, authorizeRoles(['coordinator']), (req, res) => 
  tutorController.listAlunos(req, res)
);

export default router;
