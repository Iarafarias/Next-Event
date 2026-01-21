/*
  Warnings:

  - Made the column `tipoAcesso` on table `aluno` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "coordenador" DROP CONSTRAINT "coordenador_cursoId_fkey";

-- AlterTable
ALTER TABLE "aluno" ALTER COLUMN "tipoAcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "coordenador" ALTER COLUMN "cursoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "coordenador" ADD CONSTRAINT "coordenador_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
