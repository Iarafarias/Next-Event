import { IUsuarioRepository } from './../../../../src/domain/user/repositories/IUsuarioRepository';
import { UsuarioResponseDTO } from './../../../../src/application/user/dtos/UserResponseDTO';
import { Usuario } from './../../../../src/domain/user/entities/Usuario';

function toUsuarioResponseDTO(user: Usuario): UsuarioResponseDTO {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    status: user.status,
    criadoEm: user.criadoEm || new Date(),
    atualizadoEm: user.atualizadoEm || new Date(),
    
    coordenador: user.coordenador ? {
        area: user.coordenador.area,
        nivel: user.coordenador.nivel
    } : undefined,
    tutor: user.tutor ? { ...user.tutor } : undefined,
    bolsista: user.bolsista ? { ...user.bolsista } : undefined
  };
}
