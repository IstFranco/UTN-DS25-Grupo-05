-- AlterTable
ALTER TABLE "public"."Evento" ADD COLUMN     "accesible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edadMinima" INTEGER,
ADD COLUMN     "estilo" TEXT,
ADD COLUMN     "hashtag" TEXT,
ADD COLUMN     "horaInicio" TEXT,
ADD COLUMN     "linkExterno" TEXT,
ADD COLUMN     "politicaCancelacion" TEXT,
ADD COLUMN     "precioVip" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "edad" INTEGER;

-- CreateTable
CREATE TABLE "public"."Favorito" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_usuarioId_eventoId_key" ON "public"."Favorito"("usuarioId", "eventoId");

-- AddForeignKey
ALTER TABLE "public"."Favorito" ADD CONSTRAINT "Favorito_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorito" ADD CONSTRAINT "Favorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
