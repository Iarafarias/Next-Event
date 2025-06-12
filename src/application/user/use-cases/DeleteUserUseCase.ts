import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
