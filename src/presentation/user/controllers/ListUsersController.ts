import { Request, Response } from 'express';
import { ListUsuariosUseCase } from '../../../application/user/use-cases/ListUsersUseCase';

export class ListUsuariosController {
  constructor(private listUsuariosUseCase: ListUsuariosUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const usuarios = await this.listUsuariosUseCase.execute();
    return res.json(usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      status: u.status,
      criadoEm: u.criadoEm,
      atualizadoEm: u.atualizadoEm,
      coordenador: u.coordenador,
      tutor: u.tutor,
      bolsista: u.bolsista,
    })));
  }
}
