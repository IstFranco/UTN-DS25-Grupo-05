/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,eventoId]` on the table `Inscripcion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."uniq_activa_usuario_evento_estado";

-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "sitioWeb" TEXT,
ADD COLUMN     "telefono" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_usuarioId_eventoId_key" ON "public"."Inscripcion"("usuarioId", "eventoId");

-- RenameIndex
ALTER INDEX "public"."uniq_voto_usuario_cancion" RENAME TO "Voto_usuarioId_cancionId_key";
