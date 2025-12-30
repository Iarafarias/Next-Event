import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';

export class DeleteUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
