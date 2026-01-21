import { PrismaClient } from '@prisma/client';
import { ITutorRepository } from '../../../domain/user/repositories/ITutorRepository';
import { Aluno, TipoAcessoAluno } from '../../../domain/aluno/entities/Aluno';
import logger from '../../logger/logger';

export class PostgresTutorRepository implements ITutorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findTutorByUsuarioId(usuarioId: string): Promise<{ id: string; usuarioId: string } | null> {
    try {
      const tutor = await this.prisma.tutor.findUnique({
        where: { usuarioId },
        select: {
          id: true,
          usuarioId: true
        }
      });

      return tutor;
    } catch (error: any) {
      logger.error('Erro ao buscar tutor por usuarioId', { error: error.message, usuarioId });
      throw new Error('Erro ao buscar tutor');
    }
  }

  async findAlunosByTutorId(tutorId: string): Promise<Aluno[]> {
    try {
      // Buscar alunos alocados para este tutor através da tabela AlocarTutorAluno
      const alocacoes = await this.prisma.alocarTutorAluno.findMany({
        where: {
          tutorId,
          ativo: true
        },
        include: {
          bolsista: {
            include: {
              usuario: {
                include: {
                  aluno: {
                    include: {
                      curso: true,
                      usuario: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Mapear para entidades Aluno
      const alunos: Aluno[] = [];
      
      for (const alocacao of alocacoes) {
        const bolsista = alocacao.bolsista;
        const usuarioAluno = bolsista.usuario.aluno;
        
        if (usuarioAluno) {
          const aluno = new Aluno(
            usuarioAluno.id,
            usuarioAluno.usuarioId,
            usuarioAluno.cursoId,
            usuarioAluno.matricula,
            usuarioAluno.tipoAcesso as TipoAcessoAluno,
            usuarioAluno.anoIngresso || undefined,
            usuarioAluno.semestre || undefined,
            usuarioAluno.ativo,
            usuarioAluno.criadoEm,
            usuarioAluno.atualizadoEm
          );
          
          alunos.push(aluno);
        }
      }

      return alunos;
    } catch (error: any) {
      logger.error('Erro ao buscar alunos do tutor', { error: error.message, tutorId });
      throw new Error('Erro ao buscar alunos do tutor');
    }
  }
}
