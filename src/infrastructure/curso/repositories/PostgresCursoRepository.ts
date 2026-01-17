import { PrismaClient } from '@prisma/client';
import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { CursoResponseDTO } from '../../../application/curso/dtos/CursoResponseDTO';
import { CreateCursoDTO } from '../../../application/curso/dtos/CreateCursoDTO';
import { UpdateCursoDTO } from '../../../application/curso/dtos/UpdateCursoDTO';

export class PostgresCursoRepository implements ICursoRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateCursoDTO): Promise<CursoResponseDTO> {
        const curso = await this.prisma.curso.create({
            data: {
                nome: data.nome,
                codigo: data.codigo,
                descricao: data.descricao,
            },
            include: {
                _count: {
                    select: { alunos: true }
                }
            }
        });

        return {
            id: curso.id,
            nome: curso.nome,
            codigo: curso.codigo,
            descricao: curso.descricao ?? undefined,
            criadoEm: curso.criadoEm,
            alunosCount: curso._count.alunos,
        };
    }

    async findAll(): Promise<CursoResponseDTO[]> {
        const cursos = await this.prisma.curso.findMany({
            include: {
                _count: {
                    select: { alunos: true }
                }
            },
            orderBy: {
                nome: 'asc'
            }
        });

        return cursos.map(curso => ({
            id: curso.id,
            nome: curso.nome,
            codigo: curso.codigo,
            descricao: curso.descricao ?? undefined,
            criadoEm: curso.criadoEm,
            alunosCount: curso._count.alunos,
        }));
    }

    async findById(id: string): Promise<CursoResponseDTO | null> {
        const curso = await this.prisma.curso.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { alunos: true }
                }
            }
        });

        if (!curso) return null;

        return {
            id: curso.id,
            nome: curso.nome,
            codigo: curso.codigo,
            descricao: curso.descricao ?? undefined,
            criadoEm: curso.criadoEm,
            alunosCount: curso._count.alunos,
        };
    }

    async findByCodigo(codigo: string): Promise<CursoResponseDTO | null> {
        const curso = await this.prisma.curso.findUnique({
            where: { codigo },
            include: {
                _count: {
                    select: { alunos: true }
                }
            }
        });

        if (!curso) return null;

        return {
            id: curso.id,
            nome: curso.nome,
            codigo: curso.codigo,
            descricao: curso.descricao ?? undefined,
            criadoEm: curso.criadoEm,
            alunosCount: curso._count.alunos,
        };
    }

    async update(data: UpdateCursoDTO): Promise<CursoResponseDTO | null> {
        const curso = await this.prisma.curso.update({
            where: { id: data.id },
            data: {
                nome: data.nome,
                codigo: data.codigo,
                descricao: data.descricao,
            },
            include: {
                _count: {
                    select: { alunos: true }
                }
            }
        });

        return {
            id: curso.id,
            nome: curso.nome,
            codigo: curso.codigo,
            descricao: curso.descricao ?? undefined,
            criadoEm: curso.criadoEm,
            alunosCount: curso._count.alunos,
        };
    }

    async delete(id: string): Promise<void> {
        await this.prisma.curso.delete({
            where: { id }
        });
    }
}
