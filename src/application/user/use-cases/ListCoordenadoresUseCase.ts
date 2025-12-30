import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UsuarioResponseDTO } from '../dtos/UserResponseDTO';
import { User } from '../../../domain/user/entities/User';
function toUsuarioResponseDTO(user: User): UsuarioResponseDTO {
  return {
    id: user.id,
    nome: user.name,
    email: user.email,
    status: user.role,
    criadoEm: user.createdAt,
    atualizadoEm: user.updatedAt,
    // Adicionar os campos de perfil conforme necessário
  };
}

export class ListCoordenadoresUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UsuarioResponseDTO[]> {
    const users = await this.userRepository.listByRole('coordenador');
    return users.map(toUsuarioResponseDTO);
  }
}
