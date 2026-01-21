/*
  Warnings:

  - You are about to drop the column `tipo` on the `aluno` table. All the data in the column will be lost.
  - Added the required column `tipoAcesso` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cursoId` to the `coordenador` table without a default value. This is not possible if the table is not empty.

*/

-- CreateEnum
CREATE TYPE "TipoAcessoAluno" AS ENUM ('ACESSO_TUTOR', 'ACESSO_BOLSISTA');

-- First, add tipoAcesso column with a default value
ALTER TABLE "aluno" ADD COLUMN "tipoAcesso" "TipoAcessoAluno" DEFAULT 'ACESSO_TUTOR';

-- Update existing records based on the old tipo column values
-- Map TUTOR to ACESSO_TUTOR and BOLSISTA to ACESSO_BOLSISTA
UPDATE "aluno" SET "tipoAcesso" = 'ACESSO_TUTOR' WHERE "tipo" = 'TUTOR';
UPDATE "aluno" SET "tipoAcesso" = 'ACESSO_BOLSISTA' WHERE "tipo" = 'BOLSISTA';

-- Remove the default value to make it required going forward
ALTER TABLE "aluno" ALTER COLUMN "tipoAcesso" DROP DEFAULT;

-- Now we can safely drop the old column and index
DROP INDEX "aluno_tipo_idx";
ALTER TABLE "aluno" DROP COLUMN "tipo";

-- For coordenador table, we need to handle the cursoId requirement
-- First, let's get the first curso ID to use as default
-- Add cursoId column with a temporary default
ALTER TABLE "coordenador" ADD COLUMN "cursoId" TEXT;

-- Update all coordenador records with the first available curso
-- (You may want to adjust this logic based on your business rules)
UPDATE "coordenador" 
SET "cursoId" = (SELECT "id" FROM "curso" LIMIT 1)
WHERE "cursoId" IS NULL;

-- Now make the column required
ALTER TABLE "coordenador" ALTER COLUMN "cursoId" SET NOT NULL;

-- Drop the old enum
DROP TYPE "TipoAluno";

-- Create indexes
CREATE INDEX "aluno_tipoAcesso_idx" ON "aluno"("tipoAcesso");

-- Add foreign key constraint
ALTER TABLE "coordenador" ADD CONSTRAINT "coordenador_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
