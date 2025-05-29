import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDTO } from './CreateUserDTO';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new Error('Usuário já cadastrado com este e-mail.');
    }
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    await this.userRepository.save(user);
    return user;
  }
}
