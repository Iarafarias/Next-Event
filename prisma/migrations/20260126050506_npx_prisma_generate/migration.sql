-- CreateEnum
CREATE TYPE "TipoAcessoAluno" AS ENUM ('ACESSO_TUTOR', 'ACESSO_BOLSISTA');

-- AlterTable
ALTER TABLE "coordenador" ADD COLUMN     "cursoId" TEXT;

-- CreateTable
CREATE TABLE "curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "anoIngresso" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "semestre" INTEGER DEFAULT 1,
    "tipoAcesso" "TipoAcessoAluno" NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curso_codigo_key" ON "curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_usuarioId_key" ON "aluno"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_matricula_key" ON "aluno"("matricula");

-- CreateIndex
CREATE INDEX "aluno_cursoId_idx" ON "aluno"("cursoId");

-- CreateIndex
CREATE INDEX "aluno_tipoAcesso_idx" ON "aluno"("tipoAcesso");

-- AddForeignKey
ALTER TABLE "coordenador" ADD CONSTRAINT "coordenador_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
