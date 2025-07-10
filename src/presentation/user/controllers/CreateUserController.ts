import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/user/use-cases/CreateUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, matricula, cpf, role } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 3 caracteres.' });
      }
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
      }
      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres.' });
      }
      if (!matricula || typeof matricula !== 'string' || !/^\d{6}$/.test(matricula)) {
        return res.status(400).json({ error: 'Matrícula deve conter exatamente 6 dígitos.' });
      }
      if (!cpf || typeof cpf !== 'string' || !validateCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido.' });
      }
      const user = await this.createUserUseCase.execute({ name, email, password, matricula, cpf, role });
      return res.status(201).json({
        id: user.id,
        matricula: user.matricula,
        name: user.name,
        email: user.email
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}