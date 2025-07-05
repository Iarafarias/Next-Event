import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Usuário ou senha inválidos.');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Usuário ou senha inválidos.');

    const secret = process.env.JWT_SECRET || 'changeme';
    const token = jwt.sign(
      { id: user.id, email: user.email, matricula: user.matricula },
      secret,
      { expiresIn: '1h' }
    );
    return token;
  }
}
