-- CreateEnum
CREATE TYPE "StudentRole" AS ENUM ('ALUNO', 'TUTOR', 'BOLSISTA', 'TUTOR_BOLSISTA');

-- CreateTable
CREATE TABLE "curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cursoId" TEXT,
    "matricula" TEXT,
    "role" "StudentRole" NOT NULL DEFAULT 'ALUNO',
    "tutorProfileId" TEXT,
    "bolsistaProfileId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curso_codigo_key" ON "curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_usuarioId_key" ON "aluno"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_matricula_key" ON "aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_bolsistaProfileId_key" ON "aluno"("bolsistaProfileId");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_bolsistaProfileId_fkey" FOREIGN KEY ("bolsistaProfileId") REFERENCES "bolsista"("id") ON DELETE SET NULL ON UPDATE CASCADE;
