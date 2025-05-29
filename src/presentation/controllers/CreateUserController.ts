import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../usecases/CreateUser/CreateUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 3 caracteres.' });
      }
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
      }
      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres.' });
      }

      const user = await this.createUserUseCase.execute({ name, email, password });
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
