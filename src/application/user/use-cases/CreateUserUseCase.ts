import { hash } from 'bcryptjs';
import { User } from '../../../domain/user/entities/User';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';

interface CreateUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isExistingUser: boolean;
  };
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<CreateUserResponse> {
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const passwordHash = await hash(data.password, 8);

    const user = new User({
      ...data,
      password: passwordHash,
      role: 'user',
    });

    const createdUser = await this.userRepository.create(user);

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        isExistingUser: false,
      },
    };
  }
}
