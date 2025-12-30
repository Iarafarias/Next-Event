import { hash } from 'bcryptjs';
import { Usuario } from '../../../domain/user/entities/Usuario';
import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { CreateUsuarioDTO } from '../dtos/CreateUserDTO';

interface CreateUsuarioResponse {
  usuario: {
    id: string;
    nome: string;
    email: string;
    status: string;
    criadoEm: Date;
    atualizadoEm: Date;
    coordenador?: any;
    tutor?: any;
    bolsista?: any;
  };
}

export class CreateUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(data: CreateUsuarioDTO): Promise<CreateUsuarioResponse> {
    if (!data.nome) throw new Error('Nome é obrigatório');
    if (!data.email) throw new Error('Email é obrigatório');
    if (!data.senha) throw new Error('Senha é obrigatória');

    const usuarioExists = await this.usuarioRepository.findByEmail(data.email);
    if (usuarioExists) throw new Error('Usuário já existe');

    const senhaHash = await hash(data.senha, 8);
    // Gera id do usuário agora para usar nos perfis
    const usuarioId = crypto.randomUUID();
    const usuario = new Usuario({
      nome: data.nome,
      email: data.email,
      senha: senhaHash,
      status: data.status || 'ATIVO',
      coordenador: data.coordenador
        ? {
            id: crypto.randomUUID(),
            usuarioId,
            area: data.coordenador.area,
            nivel: data.coordenador.nivel,
          }
        : undefined,
      tutor: data.tutor
        ? {
            id: crypto.randomUUID(),
            usuarioId,
            area: data.tutor.area,
            nivel: data.tutor.nivel,
            capacidadeMaxima: data.tutor.capacidadeMaxima ?? 5,
          }
        : undefined,
      bolsista: data.bolsista
        ? {
            id: crypto.randomUUID(),
            usuarioId,
            anoIngresso: data.bolsista.anoIngresso,
            curso: data.bolsista.curso,
          }
        : undefined,
    });
    usuario.id = usuarioId;
    const created = await this.usuarioRepository.create(usuario);
    return {
      usuario: {
        id: created.id,
        nome: created.nome,
        email: created.email,
        status: created.status,
        criadoEm: created.criadoEm,
        atualizadoEm: created.atualizadoEm,
        coordenador: created.coordenador,
        tutor: created.tutor,
        bolsista: created.bolsista,
      },
    };
  }
}
