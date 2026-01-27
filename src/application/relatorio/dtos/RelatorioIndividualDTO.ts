export interface RelatorioIndividualMetrica {
    label: string;
    val: string | number;
    icon: string;
}

export interface RelatorioIndividualAlunoDTO {
    usuario: {
        nome: string;
        matricula: string;
        curso: string;
    };
    metricas: RelatorioIndividualMetrica[];
    graficos: {
        name: string;
        online: number;
        presencial: number;
    }[];
    experienciaGrafico: {
        name: string;
        boa: number;
        ruim: number;
    }[];
    horasCertificado: {
        name: string;
        estudos: number;
        eventos: number;
        monitoria: number;
    }[];
    certificados: {
        id: string;
        titulo: string;
        periodo: string;
        horas: number;
        status: string;
    }[];
}

export interface RelatorioIndividualTutorDTO {
    usuario: {
        nome: string;
        matricula: string;
        curso: string;
    };
    metricas: RelatorioIndividualMetrica[];
    tutorandos: {
        id: string; // Matrícula do aluno
        nome: string;
        encontros: number;
        semestre: string;
    }[];
    dificuldadesGrafico: {
        name: string;
        sim: number;
        nao: number;
    }[];
    graficos: {
        name: string;
        online: number;
        presencial: number;
    }[];
}
