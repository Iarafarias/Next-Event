export interface CursoResponseDTO {
    id: string;
    nome: string;
    codigo: string;
    descricao?: string;
    criadoEm: Date;
    alunosCount?: number;
}
