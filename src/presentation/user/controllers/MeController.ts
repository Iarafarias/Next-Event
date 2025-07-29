import { Request, Response } from 'express';
import { PostgresUserRepository } from '../../../infrastructure/user/repositories/postgresUserRepository';

export class MeController {
  private userRepository: PostgresUserRepository;

  constructor(userRepository: PostgresUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    // Não retornar senha
    const { password, ...userData } = user;
    return res.json(userData);
  }
}
