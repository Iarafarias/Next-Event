-- CreateEnum
CREATE TYPE "StatusAtivacao" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('COORDENADOR', 'TUTOR', 'BOLSISTA');

-- CreateEnum
CREATE TYPE "StatusCertificado" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "TipoRelatorio" AS ENUM ('ALUNO', 'TUTOR', 'CERTIFICADO', 'ACOMPANHAMENTO', 'AVALIACAO');

-- CreateEnum
CREATE TYPE "CategoriaWorkload" AS ENUM ('EVENTOS', 'MONITORIA', 'ESTUDOS_INDIVIDUAIS');

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "relatedEntityId" TEXT,
    "relatedEntityType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "matricula" TEXT,
    "cpf" TEXT,
    "status" "StatusAtivacao" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordenador" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "area" TEXT,
    "nivel" TEXT,

    CONSTRAINT "coordenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "area" TEXT,
    "nivel" TEXT,
    "capacidadeMaxima" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bolsista" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "anoIngresso" INTEGER,
    "curso" TEXT,

    CONSTRAINT "bolsista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoRelatorio" NOT NULL,
    "geradorId" TEXT NOT NULL,
    "periodoId" TEXT,
    "arquivoUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_aluno" (
    "id" TEXT NOT NULL,
    "relatorioId" TEXT NOT NULL,
    "bolsistaId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "atividades" JSONB,
    "observacoes" TEXT,

    CONSTRAINT "relatorio_aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_tutor" (
    "id" TEXT NOT NULL,
    "relatorioId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "atividades" JSONB,
    "alunosAtendidos" INTEGER,

    CONSTRAINT "relatorio_tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_certificado" (
    "id" TEXT NOT NULL,
    "relatorioId" TEXT NOT NULL,
    "certificadoId" TEXT NOT NULL,
    "validacao" TEXT,
    "observacoes" TEXT,

    CONSTRAINT "relatorio_certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_acompanhamento" (
    "id" TEXT NOT NULL,
    "relatorioId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "atividades" JSONB,
    "resultados" TEXT,

    CONSTRAINT "relatorio_acompanhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_avaliacao" (
    "id" TEXT NOT NULL,
    "relatorioId" TEXT NOT NULL,
    "bolsistaId" TEXT NOT NULL,
    "nota" DOUBLE PRECISION,
    "comentarios" TEXT,
    "periodo" TEXT NOT NULL,

    CONSTRAINT "relatorio_avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificado" (
    "id" TEXT NOT NULL,
    "bolsistaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "instituicao" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "categoria" "CategoriaWorkload" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "StatusCertificado" NOT NULL DEFAULT 'PENDENTE',
    "arquivoUrl" TEXT NOT NULL,
    "comentariosAdmin" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_acompanhamento" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "bolsistaId" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "conteudo" JSONB NOT NULL,
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "form_acompanhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodo_tutoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,

    CONSTRAINT "periodo_tutoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alocar_tutor_aluno" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "bolsistaId" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "alocar_tutor_aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carga_horaria_minima" (
    "id" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "categoria" "CategoriaWorkload" NOT NULL,
    "horasMinimas" INTEGER NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "carga_horaria_minima_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_matricula_key" ON "usuario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "coordenador_usuarioId_key" ON "coordenador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_usuarioId_key" ON "tutor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "bolsista_usuarioId_key" ON "bolsista"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "relatorio_aluno_relatorioId_key" ON "relatorio_aluno"("relatorioId");

-- CreateIndex
CREATE UNIQUE INDEX "relatorio_tutor_relatorioId_key" ON "relatorio_tutor"("relatorioId");

-- CreateIndex
CREATE UNIQUE INDEX "relatorio_certificado_relatorioId_key" ON "relatorio_certificado"("relatorioId");

-- CreateIndex
CREATE UNIQUE INDEX "relatorio_acompanhamento_relatorioId_key" ON "relatorio_acompanhamento"("relatorioId");

-- CreateIndex
CREATE UNIQUE INDEX "relatorio_avaliacao_relatorioId_key" ON "relatorio_avaliacao"("relatorioId");

-- CreateIndex
CREATE UNIQUE INDEX "certificado_arquivoUrl_key" ON "certificado"("arquivoUrl");

-- CreateIndex
CREATE INDEX "alocar_tutor_aluno_tutorId_idx" ON "alocar_tutor_aluno"("tutorId");

-- CreateIndex
CREATE INDEX "alocar_tutor_aluno_bolsistaId_idx" ON "alocar_tutor_aluno"("bolsistaId");

-- CreateIndex
CREATE UNIQUE INDEX "alocar_tutor_aluno_bolsistaId_periodoId_key" ON "alocar_tutor_aluno"("bolsistaId", "periodoId");

-- CreateIndex
CREATE UNIQUE INDEX "carga_horaria_minima_periodoId_categoria_key" ON "carga_horaria_minima"("periodoId", "categoria");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordenador" ADD CONSTRAINT "coordenador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolsista" ADD CONSTRAINT "bolsista_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio" ADD CONSTRAINT "relatorio_geradorId_fkey" FOREIGN KEY ("geradorId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio" ADD CONSTRAINT "relatorio_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodo_tutoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_aluno" ADD CONSTRAINT "relatorio_aluno_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_aluno" ADD CONSTRAINT "relatorio_aluno_bolsistaId_fkey" FOREIGN KEY ("bolsistaId") REFERENCES "bolsista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_tutor" ADD CONSTRAINT "relatorio_tutor_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_tutor" ADD CONSTRAINT "relatorio_tutor_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_certificado" ADD CONSTRAINT "relatorio_certificado_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_certificado" ADD CONSTRAINT "relatorio_certificado_certificadoId_fkey" FOREIGN KEY ("certificadoId") REFERENCES "certificado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_acompanhamento" ADD CONSTRAINT "relatorio_acompanhamento_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_acompanhamento" ADD CONSTRAINT "relatorio_acompanhamento_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_avaliacao" ADD CONSTRAINT "relatorio_avaliacao_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "relatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_avaliacao" ADD CONSTRAINT "relatorio_avaliacao_bolsistaId_fkey" FOREIGN KEY ("bolsistaId") REFERENCES "bolsista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_bolsistaId_fkey" FOREIGN KEY ("bolsistaId") REFERENCES "bolsista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_acompanhamento" ADD CONSTRAINT "form_acompanhamento_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_acompanhamento" ADD CONSTRAINT "form_acompanhamento_bolsistaId_fkey" FOREIGN KEY ("bolsistaId") REFERENCES "bolsista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_acompanhamento" ADD CONSTRAINT "form_acompanhamento_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodo_tutoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alocar_tutor_aluno" ADD CONSTRAINT "alocar_tutor_aluno_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alocar_tutor_aluno" ADD CONSTRAINT "alocar_tutor_aluno_bolsistaId_fkey" FOREIGN KEY ("bolsistaId") REFERENCES "bolsista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alocar_tutor_aluno" ADD CONSTRAINT "alocar_tutor_aluno_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodo_tutoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carga_horaria_minima" ADD CONSTRAINT "carga_horaria_minima_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodo_tutoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
