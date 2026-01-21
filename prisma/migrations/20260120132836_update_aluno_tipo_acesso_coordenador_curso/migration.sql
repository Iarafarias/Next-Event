/*
  Warnings:

  - You are about to drop the column `tipo` on the `aluno` table. All the data in the column will be lost.
  - Added the required column `tipoAcesso` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cursoId` to the `coordenador` table without a default value. This is not possible if the table is not empty.

*/

-- CreateEnum
CREATE TYPE "TipoAcessoAluno" AS ENUM ('ACESSO_TUTOR', 'ACESSO_BOLSISTA');

-- Step 1: Add tipoAcesso column with default value first
ALTER TABLE "aluno" ADD COLUMN "tipoAcesso" "TipoAcessoAluno" DEFAULT 'ACESSO_TUTOR';

-- Step 2: Map existing data based on the old tipo values
-- ALUNO_TUTOR -> ACESSO_TUTOR, ALUNO_BOLSISTA -> ACESSO_BOLSISTA
-- ALUNO_REGULAR -> ACESSO_TUTOR (default behavior)
UPDATE "aluno" SET "tipoAcesso" = 'ACESSO_TUTOR' WHERE "tipo" = 'ALUNO_TUTOR';
UPDATE "aluno" SET "tipoAcesso" = 'ACESSO_BOLSISTA' WHERE "tipo" = 'ALUNO_BOLSISTA';
UPDATE "aluno" SET "tipoAcesso" = 'ACESSO_TUTOR' WHERE "tipo" = 'ALUNO_REGULAR';

-- Step 3: Make tipoAcesso required (remove default)
ALTER TABLE "aluno" ALTER COLUMN "tipoAcesso" DROP DEFAULT;

-- Step 4: Drop old column and index
DROP INDEX "aluno_tipo_idx";
ALTER TABLE "aluno" DROP COLUMN "tipo";

-- Step 5: Handle coordenador cursoId - need to populate with existing data
-- Add cursoId column as nullable first
ALTER TABLE "coordenador" ADD COLUMN "cursoId" TEXT;

-- Update with the first available curso (adjust this query as needed for your business logic)
UPDATE "coordenador" 
SET "cursoId" = (SELECT "id" FROM "curso" LIMIT 1)
WHERE "cursoId" IS NULL;

-- Make the column required
ALTER TABLE "coordenador" ALTER COLUMN "cursoId" SET NOT NULL;

-- Drop the old enum
DROP TYPE "TipoAluno";

-- Create new index
CREATE INDEX "aluno_tipoAcesso_idx" ON "aluno"("tipoAcesso");

-- Add foreign key constraint
ALTER TABLE "coordenador" ADD CONSTRAINT "coordenador_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
