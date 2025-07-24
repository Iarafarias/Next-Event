import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/user/use-cases/CreateUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, matricula, cpf, role } = request.body;

      const result = await this.createUserUseCase.execute({
        name,
        email,
        password,
        matricula,
        cpf,
        role,
      });

      return response.status(201).json(result);
    } catch (error: any) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }
}