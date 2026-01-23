import crypto from 'node:crypto';
import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { UpdateUsuarioDTO } from '../dtos/UpdateUserDTO';
import { Usuario } from '../../../domain/user/entities/Usuario';

export class UpdateUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) { }

  async execute(data: UpdateUsuarioDTO): Promise<Usuario | null> {
    try {
      const usuarioExists = await this.usuarioRepository.findById(data.id);
      if (!usuarioExists) {
        return null;
      }

      // Monta perfis completos se enviados
      const updateData: Partial<Usuario> = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        status: data.status,
      };
      if (data.coordenador) {
        updateData.coordenador = {
          id: usuarioExists.coordenador?.id || crypto.randomUUID(),
          usuarioId: data.id,
          area: data.coordenador.area,
          nivel: data.coordenador.nivel,
        };
      }
      if (data.tutor) {
        updateData.tutor = {
          id: usuarioExists.tutor?.id || crypto.randomUUID(),
          usuarioId: data.id,
          area: data.tutor.area,
          nivel: data.tutor.nivel,
          capacidadeMaxima: data.tutor.capacidadeMaxima ?? 5,
        };
      }
      if (data.bolsista) {
        updateData.bolsista = {
          id: usuarioExists.bolsista?.id || crypto.randomUUID(),
          usuarioId: data.id,
          anoIngresso: data.bolsista.anoIngresso,
          curso: data.bolsista.curso,
        };
      }

      const updatedUsuario = await this.usuarioRepository.update(updateData);
      if (!updatedUsuario) {
        return null;
      }

      return updatedUsuario;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Erro ao atualizar usuário: ' + error.message);
      }
      throw new Error('Erro ao atualizar usuário');
    }
  }
}
