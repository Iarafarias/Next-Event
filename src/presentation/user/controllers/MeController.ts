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
      const tokenUser = (req as any).user || {};
      return res.status(200).json({ id: userId, email: tokenUser.email, role: tokenUser.role });
    }
    const { password, ...userData } = user;
    return res.json(userData);
  }
}
