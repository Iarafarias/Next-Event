import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { Usuario } from '../../../domain/user/entities/Usuario';

export class ListUsuariosUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<Usuario[]> {
    return this.usuarioRepository.findAll();
  }
}
