import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { UsuarioResponseDTO } from '../dtos/UserResponseDTO';
import { Usuario } from '../../../domain/user/entities/Usuario';

function toUsuarioResponseDTO(user: Usuario): UsuarioResponseDTO {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    status: user.status,
    criadoEm: user.criadoEm,
    atualizadoEm: user.atualizadoEm,
    coordenador: user.coordenador ? {
      area: user.coordenador.area,
      nivel: user.coordenador.nivel
    } : undefined,
    tutor: user.tutor ? {
      area: user.tutor.area,
      nivel: user.tutor.nivel,
      capacidadeMaxima: user.tutor.capacidadeMaxima
    } : undefined,
    bolsista: user.bolsista ? {
      anoIngresso: user.bolsista.anoIngresso,
      curso: user.bolsista.curso
    } : undefined
  };
}

export class ListCoordenadoresUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await this.usuarioRepository.listByRole('coordenador');
    return usuarios.map(toUsuarioResponseDTO);
  }
}
