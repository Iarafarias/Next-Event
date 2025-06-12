import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { CreateUserDTO } from '../dtos/CreateUserDTO';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new Error('Usuário já cadastrado com este e-mail.');
    }
    const matriculaRegex = /^\d{6}$/;
    if (!data.matricula || !matriculaRegex.test(data.matricula)) {
      throw new Error('Matrícula deve conter 6 dígitos.');
    }
    if (!data.cpf || !validateCPF(data.cpf)) {
      throw new Error('CPF inválido.');
    }
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      matricula: data.matricula,
      cpf: data.cpf,
    });
    await this.userRepository.save(user);
    return user;
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
