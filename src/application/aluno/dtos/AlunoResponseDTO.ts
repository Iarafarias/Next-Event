export interface AlunoResponseDTO {
    id: string;
    usuarioId: string;
    cursoId?: string | null;
    matricula?: string | null;
    role: 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA';
    tutorProfileId?: string | null;
    bolsistaProfileId?: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
    // Inclus dados do usuário, curso, etc
    usuario?: {
        id: string;
        nome: string;
        email: string;
    };
    curso?: {
        id: string;
        nome: string;
        codigo: string;
    } | null;
}
