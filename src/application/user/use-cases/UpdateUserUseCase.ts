import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { User } from '../../../domain/user/entities/User';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateUserDTO): Promise<User | null> {
    try {
      const userExists = await this.userRepository.findById(data.id);
      if (!userExists) {
        throw new Error('User not found');
      }

      const updatedUser = await this.userRepository.update(data);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error updating user: ' + error.message);
      }
      throw new Error('Error updating user');
    }
  }
}
