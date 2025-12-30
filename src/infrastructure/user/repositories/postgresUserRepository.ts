import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { UpdateUsuarioDTO } from '../../../application/user/dtos/UpdateUserDTO';

export class PostgresUserRepository implements IUserRepository {
    async listByRole(role: 'coordenador' | 'tutor' | 'bolsista'): Promise<User[]> {
      const dbRoleMap: Record<string, string> = {
        coordenador: 'COORDINATOR',
        tutor: 'TUTOR',
        bolsista: 'SCHOLARSHIP_HOLDER',
      };
        let whereClause: any = {};
        if (role === 'coordenador') {
          whereClause = { coordenador: { isNot: null } };
        } else if (role === 'tutor') {
          whereClause = { tutor: { isNot: null } };
        } else if (role === 'bolsista') {
          whereClause = { bolsista: { isNot: null } };
        }
        const users = await this.prisma.usuario.findMany({ where: whereClause });
        return users.map(this.mapToUser);
    }

    async atribuirPapel(userId: string, dto: { papel: 'coordenador' | 'tutor' | 'bolsista'; acao: 'atribuir' | 'remover' }): Promise<void> {
      const dbRoleMap: Record<string, string> = {
        coordenador: 'COORDINATOR',
        tutor: 'TUTOR',
        bolsista: 'SCHOLARSHIP_HOLDER',
      };
        if (dto.acao === 'atribuir') {
          if (dto.papel === 'coordenador') {
            await this.prisma.coordenador.create({ data: { usuarioId: userId } });
          } else if (dto.papel === 'tutor') {
            await this.prisma.tutor.create({ data: { usuarioId: userId } });
          } else if (dto.papel === 'bolsista') {
            await this.prisma.bolsista.create({ data: { usuarioId: userId } });
          }
        } else if (dto.acao === 'remover') {
          if (dto.papel === 'coordenador') {
            await this.prisma.coordenador.deleteMany({ where: { usuarioId: userId } });
          } else if (dto.papel === 'tutor') {
            await this.prisma.tutor.deleteMany({ where: { usuarioId: userId } });
          } else if (dto.papel === 'bolsista') {
            await this.prisma.bolsista.deleteMany({ where: { usuarioId: userId } });
          }
        }
    }
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: User): Promise<User> {
    try {
      const roleMap: Record<string, any> = {
        admin: 'ADMIN',
        student: 'STUDENT',
        tutor: 'TUTOR',
        scholarship_holder: 'SCHOLARSHIP_HOLDER',
        coordinator: 'COORDINATOR'
      };

      const createdUser = await this.prisma.usuario.create({
        data: {
          id: user.id,
          nome: user.name,
          email: user.email,
          senha: user.password,
        }
      });

      const extra: any = user as any;
      if (extra.matricula) {
        try {
          await this.prisma.bolsista.create({
            data: {
              usuarioId: createdUser.id,
              anoIngresso: extra.enrollmentYear ?? null,
              curso: extra.curso ?? null
            }
          });
        } catch (err: any) {
          if (err.code === 'P2002') {
            await this.prisma.usuario.delete({ where: { id: createdUser.id } });
          }
          throw err;
        }
      }

      return await this.findById(createdUser.id) as User;
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
          throw new Error('Email already exists');
        }
        if (error.meta?.target?.includes('cpf')) {
          throw new Error('CPF already exists');
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { email }
    });
    return user ? this.mapToUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.usuario.findMany();
    return users.map(this.mapToUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) return null;
    const profile = await this.prisma.bolsista.findUnique({ where: { usuarioId: user.id } });
    const mapped = this.mapToUser({ ...user, bolsistaProfile: profile });
    return mapped;
  }

  async update(data: UpdateUsuarioDTO): Promise<User | null> {
    const user = await this.prisma.usuario.update({
      where: { id: data.id },
      data: {
        nome: data.nome,
        email: data.email,
        ...(data.senha && { senha: data.senha })
      }
    });
    return this.mapToUser(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.usuario.delete({
      where: { id }
    });
  }

  private mapToUser(data: any): User {
    const roleMap: Record<string, any> = {
      ADMIN: 'admin',
      STUDENT: 'student',
      TUTOR: 'tutor',
      SCHOLARSHIP_HOLDER: 'scholarship_holder',
      COORDINATOR: 'coordinator'
    };

    const user = new User({
      name: data.nome,
      email: data.email,
      password: data.senha,
      role: data.role ? roleMap[data.role as string] ?? 'student' : undefined
    });
    user.id = data.id;
    if (data.bolsistaProfile) {
      user.matricula = data.bolsistaProfile.matricula ?? undefined;
      user.cpf = data.bolsistaProfile.cpf ?? undefined;
    }
    return user;
  }
}
