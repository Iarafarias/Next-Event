import { Request, Response } from 'express';
import { AuthUserUseCase } from '../../../application/user/use-cases/AuthUserUseCase';

export class AuthUserController {
  constructor(private authUserUseCase: AuthUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const token = await this.authUserUseCase.execute(email, password);
      return res.json({ token });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
