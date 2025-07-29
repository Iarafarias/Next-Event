import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../../application/user/use-cases/UpdateUserUseCase';

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, email, password, matricula, cpf } = req.body;
    try {
      const user = await this.updateUserUseCase.execute({ id, name, email, password, matricula, cpf });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
      return res.json({ id: user.id, matricula: user.matricula, name: user.name, email: user.email, role: user.role });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
