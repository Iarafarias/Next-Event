import { Request, Response } from 'express';
import { ListUsersUseCase } from '../../../application/user/use-cases/ListUsersUseCase';

export class ListUsersController {
  constructor(private listUsersUseCase: ListUsersUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const users = await this.listUsersUseCase.execute();
    return res.json(users.map(u => ({ id: u.id, matricula: u.matricula, name: u.name, email: u.email, role: u.role })));
  }
}
