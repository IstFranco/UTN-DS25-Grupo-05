/*
  Warnings:

  - Added the required column `genero` to the `Cancion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Voto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoVoto" AS ENUM ('up', 'down');

-- AlterTable
ALTER TABLE "public"."Cancion" ADD COLUMN     "genero" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Voto" ADD COLUMN     "tipo" "public"."TipoVoto" NOT NULL;
