/*
  Warnings:

  - You are about to drop the column `bolsistaProfileId` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `tutorProfileId` on the `aluno` table. All the data in the column will be lost.
  - Made the column `cursoId` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `matricula` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `atualizadoEm` to the `curso` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoAluno" AS ENUM ('ALUNO_REGULAR', 'ALUNO_TUTOR', 'ALUNO_BOLSISTA');

-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_bolsistaProfileId_fkey";

-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_tutorProfileId_fkey";

-- DropIndex
DROP INDEX "aluno_bolsistaProfileId_key";

-- AlterTable
ALTER TABLE "aluno" DROP COLUMN "bolsistaProfileId",
DROP COLUMN "role",
DROP COLUMN "tutorProfileId",
ADD COLUMN     "anoIngresso" INTEGER,
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "semestre" INTEGER DEFAULT 1,
ADD COLUMN     "tipo" "TipoAluno" NOT NULL DEFAULT 'ALUNO_REGULAR',
ALTER COLUMN "cursoId" SET NOT NULL,
ALTER COLUMN "matricula" SET NOT NULL;

-- AlterTable
ALTER TABLE "curso" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "StudentRole";

-- CreateIndex
CREATE INDEX "aluno_cursoId_idx" ON "aluno"("cursoId");

-- CreateIndex
CREATE INDEX "aluno_tipo_idx" ON "aluno"("tipo");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
