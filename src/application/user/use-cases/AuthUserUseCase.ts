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

    let role = 'student'; // default
    if (usuario.coordenador) {
      role = 'coordinator';
    } else if (usuario.tutor) {
      role = 'tutor';
    } else if (usuario.bolsista) {
      role = 'scholarship_holder';
    }

    console.log('DEBUG AUTH - Usuario:', {
      id: usuario.id,
      email: usuario.email,
      coordenador: !!usuario.coordenador,
      tutor: !!usuario.tutor,
      bolsista: !!usuario.bolsista,
      role: role
    });

    const token = sign(
      {
        id: usuario.id,
        email: usuario.email,
        status: usuario.status,
        role: role,
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
