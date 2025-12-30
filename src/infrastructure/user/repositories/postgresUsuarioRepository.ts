import { PrismaClient } from '@prisma/client';
import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { Usuario } from '../../../domain/user/entities/Usuario';

export class PostgresUsuarioRepository implements IUsuarioRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const created = await this.prisma.usuario.create({
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        status: usuario.status ?? 'ATIVO',
      },
    });
    return this.mapToUsuario(created);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    return usuario ? this.mapToUsuario(usuario) : null;
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? this.mapToUsuario(usuario) : null;
  }

  async update(usuario: Partial<Usuario>): Promise<Usuario | null> {
    const updated = await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        status: usuario.status,
      },
    });
    return this.mapToUsuario(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map(this.mapToUsuario);
  }

  private mapToUsuario(data: any): Usuario {
    const usuario = new Usuario({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      status: data.status,
    });
    usuario.id = data.id;
    usuario.criadoEm = data.criadoEm;
    usuario.atualizadoEm = data.atualizadoEm;
    return usuario;
  }
}
