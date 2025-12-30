import { Request, Response } from 'express';
import { DeleteUsuarioUseCase } from '../../../application/user/use-cases/DeleteUserUseCase';

export class DeleteUsuarioController {
  constructor(private deleteUsuarioUseCase: DeleteUsuarioUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deleteUsuarioUseCase.execute(id);
    return res.status(204).send();
  }
}
