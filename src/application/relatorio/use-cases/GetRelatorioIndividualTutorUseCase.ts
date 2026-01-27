import { ITutorRepository } from '../../../domain/user/repositories/ITutorRepository';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import { RelatorioIndividualTutorDTO } from '../dtos/RelatorioIndividualDTO';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetRelatorioIndividualTutorUseCase {
    constructor(
        private tutorRepository: ITutorRepository,
        private formAcompanhamentoRepository: IFormAcompanhamentoRepository
    ) { }

    async execute(tutorIdOrName: string): Promise<RelatorioIndividualTutorDTO> {
        // 1. Localizar Tutor
        const tutor = await prisma.tutor.findFirst({
            where: {
                OR: [
                    { id: tutorIdOrName },
                    { usuarioId: tutorIdOrName },
                    { usuario: { nome: tutorIdOrName } }
                ]
            },
            include: {
                usuario: true,
                alocacoes: {
                    include: {
                        bolsista: {
                            include: {
                                usuario: true
                                // curso não é relacionamento, é campo string em Bolsista
                            }
                        }
                    }
                }
            }
        });

        if (!tutor) {
            throw new Error('Tutor não encontrado');
        }

        // 2. Buscar acompanhamentos do tutor
        const acompanhamentos = await this.formAcompanhamentoRepository.list({ tutorId: tutor.id });

        const alunosAtendidosIds = [...new Set(acompanhamentos.map(a => a.bolsistaId))];
        const totalEncontros = acompanhamentos.reduce((acc, curr) => {
            return acc + (Number(curr.conteudo.quantidadeReunioes) || 0);
        }, 0);

        const metricas = [
            { label: "Total de Relatórios", val: acompanhamentos.length, icon: "📄" },
            { label: "Total de Encontros", val: totalEncontros, icon: "👥" },
            { label: "Alunos Distintos", val: alunosAtendidosIds.length, icon: "🎓" },
            { label: "Média Mensal", val: (acompanhamentos.length / 1).toFixed(1), icon: "📊" }
        ];


        // Histórico de Atendimento (Tutorandos)
        const tutorandosMap = new Map<string, { nome: string, id: string, encontros: number, semestre: string }>();

        acompanhamentos.forEach(form => {
            const bId = form.bolsistaId;
            const current = tutorandosMap.get(bId) || {
                nome: form.conteudo.nomeAluno || "Aluno",
                id: bId, // Aqui poderíamos buscar a matrícula real se necessário
                encontros: 0,
                semestre: "2025.1"
            };
            current.encontros += (Number(form.conteudo.quantidadeReunioes) || 0);
            tutorandosMap.set(bId, current);
        });

        const tutorandos = Array.from(tutorandosMap.values());

        // Gráfico de Médias de Dificuldades
        const difficulties = { conteudo: 0, acesso: 0, outras: 0 };
        acompanhamentos.forEach(form => {
            const tipo = (form.conteudo.maiorDificuldadeAluno || '').toLowerCase();
            if (tipo.includes('conteúdo') || tipo === 'conteudo') difficulties.conteudo++;
            else if (tipo.includes('acesso')) difficulties.acesso++;
            else difficulties.outras++;
        });

        const dificuldadesGrafico = [
            { name: 'Conteúdo', sim: difficulties.conteudo, nao: acompanhamentos.length - difficulties.conteudo },
            { name: 'Acesso', sim: difficulties.acesso, nao: acompanhamentos.length - difficulties.acesso },
            { name: 'Outras', sim: difficulties.outras, nao: acompanhamentos.length - difficulties.outras },
        ];

        // Evolução de Encontros
        const mesesAbv = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const evolutionMap = new Map<string, { online: number, presencial: number }>();

        acompanhamentos.forEach(form => {
            const mes = mesesAbv[new Date(form.dataEnvio).getMonth()];
            const current = evolutionMap.get(mes) || { online: 0, presencial: 0 };

            if (form.conteudo.modalidadeReuniao === 'VIRTUAL') {
                current.online += (Number(form.conteudo.quantidadeVirtuais) || Number(form.conteudo.quantidadeReunioes) || 0);
            } else {
                current.presencial += (Number(form.conteudo.quantidadePresenciais) || Number(form.conteudo.quantidadeReunioes) || 0);
            }
            evolutionMap.set(mes, current);
        });

        const graficos = mesesAbv.map(mes => ({
            name: mes,
            online: evolutionMap.get(mes)?.online || 0,
            presencial: evolutionMap.get(mes)?.presencial || 0
        }));

        return {
            usuario: {
                nome: tutor.usuario.nome,
                matricula: tutor.usuario.matricula || "N/A",
                curso: tutor.area || "Não informado"
            },
            metricas,
            tutorandos,
            dificuldadesGrafico,
            graficos
        };
    }
}
