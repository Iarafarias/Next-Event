import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import logger from '../../../infrastructure/logger/logger';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { AtribuirPapelUseCase } from '../../../application/user/use-cases/AtribuirPapelUseCase';
import { AtribuirPapelController } from '../controllers/AtribuirPapelController';
import { PostgresUsuarioRepository } from '../../../infrastructure/user/repositories/postgresUsuarioRepository';
import { PostgresUserRepository } from '../../../infrastructure/user/repositories/postgresUserRepository';
import { ListCoordenadoresUseCase } from '../../../application/user/use-cases/ListCoordenadoresUseCase';
import { ListTutoresUseCase } from '../../../application/user/use-cases/ListTutoresUseCase';
import { ListBolsistasUseCase } from '../../../application/user/use-cases/ListBolsistasUseCase';
import { ListCoordenadoresController } from '../controllers/ListCoordenadoresController';
import { ListTutoresController } from '../controllers/ListTutoresController';
import { ListBolsistasController } from '../controllers/ListBolsistasController';
import { CreateUsuarioUseCase } from '../../../application/user/use-cases/CreateUserUseCase';
import { CreateUsuarioController } from '../controllers/CreateUserController';
import { ListUsuariosUseCase } from '../../../application/user/use-cases/ListUsersUseCase';
import { ListUsuariosController } from '../controllers/ListUsersController';
import { GetUsuarioByIdUseCase } from '../../../application/user/use-cases/GetUserByIdUseCase';
import { GetUsuarioByIdController } from '../controllers/GetUserByIdController';
import { UpdateUsuarioUseCase } from '../../../application/user/use-cases/UpdateUserUseCase';
import { UpdateUsuarioController } from '../controllers/UpdateUserController';
import { DeleteUsuarioUseCase } from '../../../application/user/use-cases/DeleteUserUseCase';
import { DeleteUsuarioController } from '../controllers/DeleteUserController';
import { AuthUsuarioUseCase } from '../../../application/user/use-cases/AuthUserUseCase';
import { AuthUsuarioController } from '../controllers/AuthUserController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const userRoutes = Router();
const usuarioRepository = new PostgresUsuarioRepository();
const userRepository = new PostgresUserRepository();
const listCoordenadoresUseCase = new ListCoordenadoresUseCase(userRepository);
const listTutoresUseCase = new ListTutoresUseCase(userRepository);
const listBolsistasUseCase = new ListBolsistasUseCase(userRepository);
const listCoordenadoresController = new ListCoordenadoresController(listCoordenadoresUseCase);
const listTutoresController = new ListTutoresController(listTutoresUseCase);
const listBolsistasController = new ListBolsistasController(listBolsistasUseCase);
const createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository);
const createUsuarioController = new CreateUsuarioController(createUsuarioUseCase);
const listUsuariosUseCase = new ListUsuariosUseCase(usuarioRepository);
const listUsuariosController = new ListUsuariosController(listUsuariosUseCase);
const getUsuarioByIdUseCase = new GetUsuarioByIdUseCase(usuarioRepository);
const getUsuarioByIdController = new GetUsuarioByIdController(getUsuarioByIdUseCase);
const updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository);
const updateUsuarioController = new UpdateUsuarioController(updateUsuarioUseCase);
const deleteUsuarioUseCase = new DeleteUsuarioUseCase(usuarioRepository);
const deleteUsuarioController = new DeleteUsuarioController(deleteUsuarioUseCase);
const authUsuarioUseCase = new AuthUsuarioUseCase(usuarioRepository);
const authUsuarioController = new AuthUsuarioController(authUsuarioUseCase);
const atribuirPapelUseCase = new AtribuirPapelUseCase(userRepository);
const atribuirPapelController = new AtribuirPapelController(atribuirPapelUseCase);

userRoutes.post('/', (req: Request, res: Response) => {
	logger.info('POST /usuarios - Criar usuário', { body: req.body });
	createUsuarioController.handle(req, res);
});
userRoutes.post('/login', (req: Request, res: Response) => {
	logger.info('POST /usuarios/login - Tentativa de login', { body: req.body });
	authUsuarioController.handle(req, res);
});
userRoutes.get('/', authMiddleware, authorizeRoles(['admin']), (req: Request, res: Response) => {
	logger.info('GET /usuarios - Listar usuários', { user: req.user });
	listUsuariosController.handle(req, res);
});
userRoutes.get('/:id', authMiddleware, (req: Request, res: Response) => {
	logger.info('GET /usuarios/:id - Buscar usuário', { user: req.user, params: req.params });
	getUsuarioByIdController.handle(req, res);
});
userRoutes.put('/:id', authMiddleware, (req: Request, res: Response) => {
	logger.info('PUT /usuarios/:id - Atualizar usuário', { user: req.user, params: req.params, body: req.body });
	updateUsuarioController.handle(req, res);
});
userRoutes.delete('/:id', authMiddleware, authorizeRoles(['admin']), (req: Request, res: Response) => {
	logger.info('DELETE /usuarios/:id - Remover usuário', { user: req.user, params: req.params });
	deleteUsuarioController.handle(req, res);
});

userRoutes.patch(
	'/:id/atribuir-papel',
	authMiddleware,
	authorizeRoles(['admin']),
	[param('id').isString().notEmpty(), body('papel').isString().notEmpty(), validationMiddleware],
	(req: Request, res: Response) => {
		logger.info('PATCH /usuarios/:id/atribuir-papel - Atribuir/remover papel', { user: req.user, params: req.params, body: req.body });
		atribuirPapelController.handle(req, res);
	}
);

userRoutes.get('/coordenadores', authMiddleware, authorizeRoles(['admin']), (req: Request, res: Response) => {
	logger.info('GET /usuarios/coordenadores - Listar coordenadores', { user: req.user });
	listCoordenadoresController.handle(req, res);
});
userRoutes.get('/tutores', authMiddleware, authorizeRoles(['admin']), (req: Request, res: Response) => {
	logger.info('GET /usuarios/tutores - Listar tutores', { user: req.user });
	listTutoresController.handle(req, res);
});
userRoutes.get('/bolsistas', authMiddleware, authorizeRoles(['admin']), (req: Request, res: Response) => {
	logger.info('GET /usuarios/bolsistas - Listar bolsistas', { user: req.user });
	listBolsistasController.handle(req, res);
});

export { userRoutes };
