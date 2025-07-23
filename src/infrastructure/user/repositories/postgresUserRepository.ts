import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { UpdateUserDTO } from '../../../application/user/dtos/UpdateUserDTO';

export class PostgresUserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          matricula: user.matricula,
          cpf: user.cpf,
          role: user.role
        }
      });

      return this.mapToUser(createdUser);
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
          throw new Error('Email already exists');
        }
        if (error.meta?.target?.includes('cpf')) {
          throw new Error('CPF already exists');
        }
        if (error.meta?.target?.includes('matricula')) {
          throw new Error('Matricula already exists');
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    return user ? this.mapToUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.mapToUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    return user ? this.mapToUser(user) : null;
  }

  async update(data: UpdateUserDTO): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        ...(data.password && { password: data.password })
      }
    });
    return this.mapToUser(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }

  private mapToUser(data: any): User {
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      matricula: data.matricula,
      cpf: data.cpf,
      role: data.role
    });
    user.id = data.id;
    return user;
  }
}
