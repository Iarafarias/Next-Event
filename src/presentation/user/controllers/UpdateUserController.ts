import { Request, Response } from 'express';
import { UpdateUsuarioUseCase } from '../../../application/user/use-cases/UpdateUserUseCase';

export class UpdateUsuarioController {
  constructor(private updateUsuarioUseCase: UpdateUsuarioUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, email, senha, status, coordenador, tutor, bolsista } = req.body;
    try {
      const usuario = await this.updateUsuarioUseCase.execute({ id, nome, email, senha, status, coordenador, tutor, bolsista });
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
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
