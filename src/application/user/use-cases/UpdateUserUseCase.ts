import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { User} from '../../../domain/user/entities/User';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateUserDTO): Promise<User | null> {
    if (data.matricula !== undefined) {
      throw new Error('Matrícula não pode ser alterada.');
    }
    if (data.cpf !== undefined) {
      throw new Error('CPF não pode ser alterado.');
    }
    return this.userRepository.update(data);
  }
}
