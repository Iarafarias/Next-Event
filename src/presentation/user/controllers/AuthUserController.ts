import { Request, Response } from 'express';
import { AuthUserUseCase } from '../../../application/user/use-cases/AuthUserUseCase';

interface AuthRequestBody {
  email: string;
  password: string;
}

export class AuthUserController {
  constructor(private authUserUseCase: AuthUserUseCase) {}

  async handle(
    req: Request<{}, {}, AuthRequestBody>,
    res: Response
  ): Promise<Response> {
    const { email, password } = req.body;

    try {
      const token = await this.authUserUseCase.execute(email, password);
      return res.json({ token });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
