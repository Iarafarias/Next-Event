import { Request, Response } from 'express';
import { AuthUserUseCase } from '../../../application/user/use-cases/AuthUserUseCase';

export class AuthUserController {
  constructor(private authUserUseCase: AuthUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      const result = await this.authUserUseCase.execute({
        email,
        password,
      });

      return response.json(result);
    } catch (error: any) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }
}
