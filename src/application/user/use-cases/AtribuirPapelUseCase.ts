import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { AtribuirPapelDTO } from '../dtos/AtribuirPapelDTO';

export class AtribuirPapelUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, dto: AtribuirPapelDTO): Promise<void> {
    await this.userRepository.atribuirPapel(userId, dto);
  }
}
