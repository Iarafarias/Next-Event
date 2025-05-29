import { Router } from 'express';
import { InMemoryUserRepository } from '../../infra/repositories/InMemoryUserRepository';
import { CreateUserUseCase } from '../../usecases/CreateUser/CreateUserUseCase';
import { CreateUserController } from '../controllers/CreateUserController';

const userRoutes = Router();

const userRepository = new InMemoryUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);

userRoutes.post('/users', (req, res) => createUserController.handle(req, res));

export { userRoutes };
