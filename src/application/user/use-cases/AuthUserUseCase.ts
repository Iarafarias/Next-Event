import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';

interface AuthUsuarioRequest {
  email: string;
  senha: string;
}

interface AuthUsuarioResponse {
  usuario: {
    id: string;
    nome: string;
    email: string;
    status: string;
    criadoEm: Date;
    atualizadoEm: Date;
  };
  token: string;
}

export class AuthUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute({ email, senha }: AuthUsuarioRequest): Promise<AuthUsuarioResponse> {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) throw new Error('Email ou senha incorretos');

    const senhaOk = await compare(senha, usuario.senha);
    if (!senhaOk) throw new Error('Email ou senha incorretos');

    const token = sign(
      {
        id: usuario.id,
        email: usuario.email,
        status: usuario.status,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        status: usuario.status,
        criadoEm: usuario.criadoEm,
        atualizadoEm: usuario.atualizadoEm,
      },
      token,
    };
  }
}
