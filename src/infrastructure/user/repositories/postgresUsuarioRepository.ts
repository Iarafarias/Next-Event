import { PrismaClient } from '@prisma/client';
import { IUsuarioRepository } from '../../../domain/user/repositories/IUsuarioRepository';
import { Usuario } from '../../../domain/user/entities/Usuario';

export class PostgresUsuarioRepository implements IUsuarioRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Criar Usuario
      const created = await tx.usuario.create({
        data: {
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          status: usuario.status ?? 'ATIVO',
        },
      });

      // 2. Determinar role do Aluno e IDs de perfis
      let studentRole: 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA' = 'ALUNO';
      let tutorProfileId: string | null = null;
      let bolsistaProfileId: string | null = null;

      // 3. Criar perfis adicionais e ajustar role
      if (usuario.coordenador) {
        await tx.coordenador.create({
          data: {
            usuarioId: created.id,
            area: usuario.coordenador.area,
            nivel: usuario.coordenador.nivel,
          }
        });
      }

      if (usuario.tutor) {
        const tutor = await tx.tutor.create({
          data: {
            usuarioId: created.id,
            area: usuario.tutor.area,
            nivel: usuario.tutor.nivel,
            capacidadeMaxima: usuario.tutor.capacidadeMaxima ?? 5,
          }
        });
        tutorProfileId = tutor.id;
        studentRole = 'TUTOR';
      }

      if (usuario.bolsista) {
        const bolsista = await tx.bolsista.create({
          data: {
            usuarioId: created.id,
            anoIngresso: usuario.bolsista.anoIngresso,
            curso: usuario.bolsista.curso,
          }
        });
        bolsistaProfileId = bolsista.id;
        studentRole = tutorProfileId ? 'TUTOR_BOLSISTA' : 'BOLSISTA';
      }

      // 4. SEMPRE criar registro Aluno (perfil base)
      await tx.aluno.create({
        data: {
          usuarioId: created.id,
          cursoId: usuario.aluno?.cursoId,
          matricula: usuario.aluno?.matricula,
          role: studentRole,
          tutorProfileId,
          bolsistaProfileId,
        }
      });

      // 5. Retornar usuario com todos os relacionamentos
      return await tx.usuario.findUnique({
        where: { id: created.id },
        include: {
          coordenador: true,
          tutor: true,
          bolsista: true,
          aluno: {
            include: {
              curso: true,
            }
          },
        }
      });
    });

    return this.mapToUsuario(result!);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        coordenador: true,
        tutor: true,
        bolsista: true,
        aluno: true,
      }
    });
    return usuario ? this.mapToUsuario(usuario) : null;
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        coordenador: true,
        tutor: true,
        bolsista: true,
        aluno: true,
      }
    });
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
    const usuarios = await this.prisma.usuario.findMany({
      include: {
        coordenador: true,
        tutor: true,
        bolsista: true,
        aluno: true,
      }
    });
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

    if (data.coordenador) {
      usuario.coordenador = data.coordenador;
    }
    if (data.tutor) {
      usuario.tutor = data.tutor;
    }
    if (data.bolsista) {
      usuario.bolsista = data.bolsista;
    }

    if (data.aluno) {
      usuario.aluno = data.aluno;
    }

    return usuario;
  }
}
