import { Request, Response } from 'express';
import { DeleteUserUseCase } from '../../../application/user/use-cases/DeleteUserUseCase';

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deleteUserUseCase.execute(id);
    return res.status(204).send();
  }
}
