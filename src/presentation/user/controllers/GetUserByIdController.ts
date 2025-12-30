import { Request, Response } from 'express';
import { GetUsuarioByIdUseCase } from '../../../application/user/use-cases/GetUserByIdUseCase';

export class GetUsuarioByIdController {
  constructor(private getUsuarioByIdUseCase: GetUsuarioByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const usuario = await this.getUsuarioByIdUseCase.execute(id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.status,
      criadoEm: usuario.criadoEm,
      atualizadoEm: usuario.atualizadoEm,
      coordenador: usuario.coordenador,
      tutor: usuario.tutor,
      bolsista: usuario.bolsista,
    });
  }
}
