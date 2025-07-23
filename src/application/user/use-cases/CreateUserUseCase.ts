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
    // Validate required fields
    if (!data.name) {
      throw new Error('Name is required');
    }
    if (!data.email) {
      throw new Error('Email is required');
    }
    if (!data.password) {
      throw new Error('Password is required');
    }
    if (!data.matricula) {
      throw new Error('Matricula is required');
    }
    if (!data.cpf) {
      throw new Error('CPF is required');
    }

    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const passwordHash = await hash(data.password, 8);

    const user = new User({
      ...data,
      password: passwordHash,
      role: data.role || 'participant',
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
