import { Request, Response } from 'express';
import { GetUserByIdUseCase } from '../../../application/user/use-cases/GetUserByIdUseCase';

export class GetUserByIdController {
  constructor(private getUserByIdUseCase: GetUserByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await this.getUserByIdUseCase.execute(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json({ id: user.id, matricula: user.matricula, name: user.name, email: user.email, role: user.role });
  }
}
