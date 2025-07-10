import { Router, Request, Response } from 'express';
import { PostgresUserRepository } from '../../../infrastructure/user/repositories/postgresUserRepository';
import { CreateUserUseCase } from '../../../application/user/use-cases/CreateUserUseCase';
import { CreateUserController } from '../controllers/CreateUserController';
import { ListUsersUseCase } from '../../../application/user/use-cases/ListUsersUseCase';
import { ListUsersController } from '../controllers/ListUsersController';
import { GetUserByIdUseCase } from '../../../application/user/use-cases/GetUserByIdUseCase';
import { GetUserByIdController } from '../controllers/GetUserByIdController';
import { UpdateUserUseCase } from '../../../application/user/use-cases/UpdateUserUseCase';
import { UpdateUserController } from '../controllers/UpdateUserController';
import { DeleteUserUseCase } from '../../../application/user/use-cases/DeleteUserUseCase';
import { DeleteUserController } from '../controllers/DeleteUserController';
import { AuthUserUseCase } from '../../../application/user/use-cases/AuthUserUseCase';
import { AuthUserController } from '../controllers/AuthUserController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { MeController } from '../controllers/MeController';
import { authorizeRoles } from '../../middlewares/authorizeRoles';

const userRoutes = Router();

const userRepository = new PostgresUserRepository();

const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const listUsersController = new ListUsersController(listUsersUseCase);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const updateUserController = new UpdateUserController(updateUserUseCase);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);
const authUserUseCase = new AuthUserUseCase(userRepository);
const authUserController = new AuthUserController(authUserUseCase);
const meController = new MeController(userRepository);

userRoutes.post('/users', (req: Request, res: Response) => createUserController.handle(req, res));
userRoutes.get('/users', (req: Request, res: Response) => listUsersController.handle(req, res));
userRoutes.get('/users/:id', (req: Request, res: Response) => getUserByIdController.handle(req, res));
userRoutes.put('/users/:id', authMiddleware, authorizeRoles('admin'), (req: Request, res: Response) => updateUserController.handle(req, res));
userRoutes.delete('/users/:id', authMiddleware, authorizeRoles('admin'), (req: Request, res: Response) => deleteUserController.handle(req, res));
userRoutes.post('/login', (req: Request, res: Response) => authUserController.handle(req, res));
userRoutes.get('/users/me', authMiddleware, authorizeRoles('admin', 'participant'), (req: Request, res: Response) => meController.handle(req, res));
userRoutes.get('/users/me/:id', authMiddleware, (req: Request, res: Response) => getUserByIdController.handle(req, res));



export { userRoutes };
