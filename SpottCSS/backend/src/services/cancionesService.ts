// Spott/backend/src/services/cancionesService.ts
import { prisma } from "../data/prisma.js";

/** El género de la canción debe coincidir con el del evento (campo Evento.musica).**/

export async function assertGeneroCompatible(
    eventoId: string,
    generoCancion?: string
) {
    const evento = await prisma.evento.findUnique({
    where: { id: eventoId },
    select: { musica: true }, // <— ESTE es el campo correcto en Evento
    });

    if (!evento) {
    const err: any = new Error("El evento no existe");
    err.status = 404;
    throw err;
    }

  // Si no mandan 'generoCancion', no comparamos (el controller hace fallback a evento.musica)
    const genero = String(generoCancion ?? "").trim().toLowerCase();
    if (!genero) return;

    const generoEvento = String(evento.musica ?? "").trim().toLowerCase();

    if (generoEvento && genero && generoEvento !== genero) {
    const err: any = new Error(
        `El género de la canción (“${generoCancion}”) debe coincidir con el género del evento (“${evento.musica}”).`
    );
    err.status = 400;
    throw err;
    }
}


