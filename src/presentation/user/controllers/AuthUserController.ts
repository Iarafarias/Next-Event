import { Request, Response } from 'express';
import { AuthUsuarioUseCase } from '../../../application/user/use-cases/AuthUserUseCase';

export class AuthUsuarioController {
  constructor(private authUsuarioUseCase: AuthUsuarioUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, senha } = request.body;

      const result = await this.authUsuarioUseCase.execute({
        email,
        senha,
      });

      return response.json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
