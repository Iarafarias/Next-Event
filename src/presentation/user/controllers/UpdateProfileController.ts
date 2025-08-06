import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../../application/user/use-cases/UpdateUserUseCase';

export class UpdateProfileController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const { name, email, password, matricula, cpf } = req.body;

      if (!name && !email && !password && !matricula && !cpf) {
        return res.status(400).json({ 
          error: 'Pelo menos um campo deve ser fornecido para atualização.' 
        });
      }

      if (email && !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido.' });
      }

      if (cpf && !/^\d{11}$/.test(cpf.replace(/\D/g, ''))) {
        return res.status(400).json({ error: 'CPF deve conter 11 dígitos.' });
      }

      const updatedUser = await this.updateUserUseCase.execute({ 
        id: userId, 
        name, 
        email, 
        password, 
        matricula, 
        cpf 
      });

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const { password: _, ...userResponse } = updatedUser;
      
      return res.json({
        message: 'Perfil atualizado com sucesso.',
        user: userResponse
      });

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);

      if (error.message.includes('email já está em uso')) {
        return res.status(409).json({ error: 'Este email já está sendo usado por outro usuário.' });
      }
      
      if (error.message.includes('matrícula já está em uso')) {
        return res.status(409).json({ error: 'Esta matrícula já está sendo usada por outro usuário.' });
      }

      if (error.message.includes('CPF já está em uso')) {
        return res.status(409).json({ error: 'Este CPF já está sendo usado por outro usuário.' });
      }

      return res.status(400).json({ 
        error: error.message || 'Erro interno do servidor.' 
      });
    }
  }
}
