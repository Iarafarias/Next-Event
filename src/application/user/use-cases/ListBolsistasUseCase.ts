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
      id: user.coordenador.id,
      area: user.coordenador.area,
      nivel: user.coordenador.nivel
    } : undefined,
    tutor: user.tutor ? {
      id: user.tutor.id,
      area: user.tutor.area,
      nivel: user.tutor.nivel,
      capacidadeMaxima: user.tutor.capacidadeMaxima
    } : undefined,
    bolsista: user.bolsista ? {
      id: user.bolsista.id,
      anoIngresso: user.bolsista.anoIngresso,
      curso: user.bolsista.curso
    } : undefined
  };
}

export class ListBolsistasUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) { }

  async execute(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await this.usuarioRepository.listByRole('bolsista');
    return usuarios.map(toUsuarioResponseDTO);
  }
}
