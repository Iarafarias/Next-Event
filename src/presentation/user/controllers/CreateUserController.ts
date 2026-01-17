import { Request, Response } from 'express';
import { CreateUsuarioUseCase } from '../../../application/user/use-cases/CreateUserUseCase';

export class CreateUsuarioController {
  constructor(private createUsuarioUseCase: CreateUsuarioUseCase) { }

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { nome, email, senha, status, aluno, coordenador, tutor, bolsista } = request.body;

      const result = await this.createUsuarioUseCase.execute({
        nome,
        email,
        senha,
        status,
        aluno,
        coordenador,
        tutor,
        bolsista,
      });

      return response.status(201).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}