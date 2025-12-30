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

export class ListBolsistasUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UsuarioResponseDTO[]> {
    const users = await this.userRepository.listByRole('bolsista');
    return users.map(toUsuarioResponseDTO);
  }
}
