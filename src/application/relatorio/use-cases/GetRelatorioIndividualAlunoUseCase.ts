import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';
import { RelatorioIndividualAlunoDTO } from '../dtos/RelatorioIndividualDTO';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetRelatorioIndividualAlunoUseCase {
    constructor(
        private alunoRepository: IAlunoRepository,
        private certificateRepository: ICertificateRepository,
        private formAcompanhamentoRepository: IFormAcompanhamentoRepository
    ) { }

    async execute(userIdOrMatricula: string): Promise<RelatorioIndividualAlunoDTO> {
        // 1. Localizar Bolsista (onde estão alocacoes e certificados)
        const bolsista = await prisma.bolsista.findFirst({
            where: {
                OR: [
                    { usuarioId: userIdOrMatricula },
                    { id: userIdOrMatricula },
                    { usuario: { matricula: userIdOrMatricula } }
                ]
            },
            include: {
                usuario: true,
                alocacoes: {
                    where: { ativo: true },
                    include: { tutor: { include: { usuario: true } } }
                }
            }
        });

        if (!bolsista) {
            throw new Error('Bolsista não encontrado');
        }

        // Buscar curso na tabela Aluno (relacionamento formal)
        const alunoRecord = await prisma.aluno.findUnique({
            where: { usuarioId: bolsista.usuarioId },
            include: { curso: true }
        });

        const cursoNome = alunoRecord?.curso.nome || bolsista.curso || "Não informado";

        // Buscar certificados
        const certificadosRaw = await this.certificateRepository.findByUserId(bolsista.usuarioId);

        // Buscar acompanhamentos (Encontros)
        const acompanhamentos = await this.formAcompanhamentoRepository.list({ bolsistaId: bolsista.id });

        // Buscar avaliações feitas pelo aluno sobre a tutoria
        const avaliacoes = await prisma.avaliacaoTutoria.findMany({
            where: { usuarioId: bolsista.usuarioId, tipoAvaliador: 'ALUNO' },
            orderBy: { dataEnvio: 'desc' }
        });

        const tutorAtivo = bolsista.alocacoes.length > 0 ? bolsista.alocacoes[0].tutor.usuario.nome : "Não atribuído";
        const ultimaAvaliacao = avaliacoes.length > 0 ? (avaliacoes[0].conteudo as any) : null;

        const getDificuldadeTexto = (av: any) => {
            if (!av) return 'Não informado';
            if (av.dificuldadesConteudo === 'Sim') return 'Complexidade Conteúdo';
            if (av.dificuldadesComunicacao === 'Sim') return 'Comunicação Tutor';
            if (av.dificuldadesMetodologicas === 'Sim') return 'Metodologia';
            if (av.dificuldadesRecursos === 'Sim') return 'Recursos';
            if (av.outrasDificuldades) return av.outrasDificuldades;
            return 'Nenhuma';
        };

        const totalEncontrosRealizados = acompanhamentos.reduce((acc, curr) => {
            return acc + (Number((curr.conteudo as any).quantidadeReunioes) || 0);
        }, 0);

        // Métricas
        const metricas = [
            { label: "Tutorando", val: bolsista.usuario.nome, icon: "🧑‍🎓" },
            { label: "Curso", val: cursoNome, icon: "💻" },
            { label: "Tutor Responsável", val: tutorAtivo, icon: "👩‍🏫" },
            { label: "Encontros Realizados", val: totalEncontrosRealizados, icon: "📅" },
            { label: "Certificados", val: certificadosRaw.length, icon: "🏅" },
            { label: "Mantém tutoria?", val: ultimaAvaliacao?.recomendariaPrograma ? 'Sim' : 'Não', icon: "📚" },
            { label: "Maior dificuldade", val: getDificuldadeTexto(ultimaAvaliacao), icon: "🤯" },
            { label: "Satisfação Geral", val: this.calcularMediaSatisfacao(avaliacoes), icon: "🏅" }
        ];



        // Processar Gráfico de Encontros (Online vs Presencial)
        const mesesAbv = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const encontrosMap = new Map<string, { online: number, presencial: number }>();

        acompanhamentos.forEach(form => {
            const mes = mesesAbv[new Date(form.dataEnvio).getMonth()];
            const current = encontrosMap.get(mes) || { online: 0, presencial: 0 };

            if (form.conteudo.modalidadeReuniao === 'VIRTUAL') {
                current.online += (Number(form.conteudo.quantidadeVirtuais) || Number(form.conteudo.quantidadeReunioes) || 1);
            } else {
                current.presencial += (Number(form.conteudo.quantidadePresenciais) || 1);
            }
            encontrosMap.set(mes, current);
        });

        const graficos = mesesAbv.map(mes => ({
            name: mes,
            online: encontrosMap.get(mes)?.online || 0,
            presencial: encontrosMap.get(mes)?.presencial || 0
        }));

        // Processar Gráfico de Horas por Certificado
        const horasMap = new Map<string, { estudos: number, eventos: number, monitoria: number }>();
        certificadosRaw.filter(c => c.status === 'approved').forEach(cert => {
            const mes = mesesAbv[new Date(cert.startDate).getMonth()];
            const current = horasMap.get(mes) || { estudos: 0, eventos: 0, monitoria: 0 };

            const cat = cert.category.toLowerCase();
            if (cat.includes('estudo')) current.estudos += cert.workload;
            else if (cat.includes('evento')) current.eventos += cert.workload;
            else if (cat.includes('monitoria')) current.monitoria += cert.workload;

            horasMap.set(mes, current);
        });

        const horasCertificado = mesesAbv.map(mes => ({
            name: mes,
            estudos: horasMap.get(mes)?.estudos || 0,
            eventos: horasMap.get(mes)?.eventos || 0,
            monitoria: horasMap.get(mes)?.monitoria || 0
        }));

        // Experiência (Baseado no conteúdo da avaliação)
        const expMap = new Map<string, { boa: number, ruim: number }>();
        avaliacoes.forEach(av => {
            const mes = mesesAbv[new Date(av.dataEnvio).getMonth()];
            const current = expMap.get(mes) || { boa: 0, ruim: 0 };
            const conteudo = av.conteudo as any;
            const satisfacaoLabel = conteudo.nivelSatisfacaoGeral || '';
            if (['SATISFEITO', 'MUITO_SATISFEITO', 'NEUTRO'].includes(satisfacaoLabel)) current.boa++;
            else current.ruim++;
            expMap.set(mes, current);
        });


        const experienciaGrafico = mesesAbv.map(mes => ({
            name: mes,
            boa: expMap.get(mes)?.boa || 0,
            ruim: expMap.get(mes)?.ruim || 0
        }));

        return {
            usuario: {
                nome: bolsista.usuario.nome,
                matricula: bolsista.usuario.matricula || "",
                curso: cursoNome
            },
            metricas,
            graficos,
            experienciaGrafico,
            horasCertificado,
            certificados: certificadosRaw.map(c => ({
                id: c.id,
                titulo: c.title,
                periodo: `${new Date(c.startDate).toLocaleDateString()} - ${new Date(c.endDate).toLocaleDateString()}`,
                horas: c.workload,
                status: c.status
            }))
        };
    }

    private calcularMediaSatisfacao(avaliacoes: any[]): string {
        if (avaliacoes.length === 0) return 'N/A';

        const mapSatisfacaoToPct: Record<string, number> = {
            'MUITO_INSATISFEITO': 20,
            'INSATISFEITO': 40,
            'NEUTRO': 60,
            'SATISFEITO': 80,
            'MUITO_SATISFEITO': 100
        };

        const sum = avaliacoes.reduce((acc, av) => {
            const label = (av.conteudo as any).nivelSatisfacaoGeral || '';
            const val = mapSatisfacaoToPct[label] || 0;
            return acc + val;
        }, 0);

        return `${Math.round(sum / avaliacoes.length)}%`;
    }

}
