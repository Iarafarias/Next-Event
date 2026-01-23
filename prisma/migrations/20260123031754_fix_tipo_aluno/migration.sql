-- CreateTable
CREATE TABLE "avaliacao_tutoria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "tipoAvaliador" TEXT NOT NULL,
    "conteudo" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacao_tutoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "avaliacao_tutoria_periodoId_idx" ON "avaliacao_tutoria"("periodoId");

-- CreateIndex
CREATE INDEX "avaliacao_tutoria_tipoAvaliador_idx" ON "avaliacao_tutoria"("tipoAvaliador");

-- CreateIndex
CREATE INDEX "avaliacao_tutoria_status_idx" ON "avaliacao_tutoria"("status");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_tutoria_usuarioId_periodoId_tipoAvaliador_key" ON "avaliacao_tutoria"("usuarioId", "periodoId", "tipoAvaliador");

-- AddForeignKey
ALTER TABLE "avaliacao_tutoria" ADD CONSTRAINT "avaliacao_tutoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_tutoria" ADD CONSTRAINT "avaliacao_tutoria_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodo_tutoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
