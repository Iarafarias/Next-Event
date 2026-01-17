import { PrismaClient } from '@prisma/client';
import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { AlunoResponseDTO } from '../../../application/aluno/dtos/AlunoResponseDTO';
import { UpdateAlunoDTO } from '../../../application/aluno/dtos/UpdateAlunoDTO';

export class PostgresAlunoRepository implements IAlunoRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(filters?: { cursoId?: string; role?: string }): Promise<AlunoResponseDTO[]> {
        const whereClause: any = {};

        if (filters?.cursoId) {
            whereClause.cursoId = filters.cursoId;
        }

        if (filters?.role) {
            whereClause.role = filters.role;
        }

        const alunos = await this.prisma.aluno.findMany({
            where: whereClause,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        codigo: true,
                    }
                }
            },
            orderBy: {
                criadoEm: 'desc'
            }
        });

        return alunos.map(aluno => ({
            id: aluno.id,
            usuarioId: aluno.usuarioId,
            cursoId: aluno.cursoId,
            matricula: aluno.matricula,
            role: aluno.role as 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA',
            tutorProfileId: aluno.tutorProfileId,
            bolsistaProfileId: aluno.bolsistaProfileId,
            criadoEm: aluno.criadoEm,
            atualizadoEm: aluno.atualizadoEm,
            usuario: aluno.usuario,
            curso: aluno.curso,
        }));
    }

    async findById(id: string): Promise<AlunoResponseDTO | null> {
        const aluno = await this.prisma.aluno.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        codigo: true,
                    }
                }
            }
        });

        if (!aluno) return null;

        return {
            id: aluno.id,
            usuarioId: aluno.usuarioId,
            cursoId: aluno.cursoId,
            matricula: aluno.matricula,
            role: aluno.role as 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA',
            tutorProfileId: aluno.tutorProfileId,
            bolsistaProfileId: aluno.bolsistaProfileId,
            criadoEm: aluno.criadoEm,
            atualizadoEm: aluno.atualizadoEm,
            usuario: aluno.usuario,
            curso: aluno.curso,
        };
    }

    async findByUsuarioId(usuarioId: string): Promise<AlunoResponseDTO | null> {
        const aluno = await this.prisma.aluno.findUnique({
            where: { usuarioId },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        codigo: true,
                    }
                }
            }
        });

        if (!aluno) return null;

        return {
            id: aluno.id,
            usuarioId: aluno.usuarioId,
            cursoId: aluno.cursoId,
            matricula: aluno.matricula,
            role: aluno.role as 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA',
            tutorProfileId: aluno.tutorProfileId,
            bolsistaProfileId: aluno.bolsistaProfileId,
            criadoEm: aluno.criadoEm,
            atualizadoEm: aluno.atualizadoEm,
            usuario: aluno.usuario,
            curso: aluno.curso,
        };
    }

    async update(data: UpdateAlunoDTO): Promise<AlunoResponseDTO | null> {
        const aluno = await this.prisma.aluno.update({
            where: { id: data.id },
            data: {
                cursoId: data.cursoId,
                matricula: data.matricula,
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    }
                },
                curso: {
                    select: {
                        id: true,
                        nome: true,
                        codigo: true,
                    }
                }
            }
        });

        return {
            id: aluno.id,
            usuarioId: aluno.usuarioId,
            cursoId: aluno.cursoId,
            matricula: aluno.matricula,
            role: aluno.role as 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA',
            tutorProfileId: aluno.tutorProfileId,
            bolsistaProfileId: aluno.bolsistaProfileId,
            criadoEm: aluno.criadoEm,
            atualizadoEm: aluno.atualizadoEm,
            usuario: aluno.usuario,
            curso: aluno.curso,
        };
    }
}
