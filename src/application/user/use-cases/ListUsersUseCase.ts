import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
