import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { Usuario } from '../../../domain/user/entities/Usuario';

export class GetUsuarioByIdUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findById(id);
  }
}
