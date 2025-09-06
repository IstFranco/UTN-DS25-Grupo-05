// Spott/backend/src/controllers/cancionesController.ts
import type { Request, Response } from "express";
import { prisma } from "../data/prisma.js";
import { getTrackById } from "../spotify/spotifyService.js";
import { assertGeneroCompatible } from "../services/cancionesService.js";
import type { Cancion, Voto, Prisma } from "@prisma/client";
import { TipoVoto } from "@prisma/client";

/** Canción con la relación 'votos' tipada */
type CancionConVotos = Cancion & { votos: Voto[] };

/**
 * POST /api/canciones
 * - Si no mandan genero, usa el del evento (evento.musica)
 * - Si mandan genero, valida que coincida con el del evento
 */
export const crearCancion = async (req: Request, res: Response) => {
    try {
    const { eventoId, titulo, artista, spotifyId } = req.body || {};
    let { genero } = req.body || {};

    if (!eventoId || !titulo || !artista) {
        return res
        .status(400)
        .json({ message: "eventoId, titulo y artista son requeridos" });
    }

    // Traer evento para fallback/validación
    const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
        select: { musica: true, nombre: true },
    });
    if (!evento) {
        return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Fallback del género o validación
    if (!genero) {
        genero = evento.musica;
        console.log(
        `🎵 Género automático obtenido del evento "${evento.nombre}": ${genero}`
        );
    } else {
        await assertGeneroCompatible(eventoId, genero);
    }

    const c = await prisma.cancion.create({
        data: { eventoId, titulo, artista, genero, spotifyId },
    });

    return res.status(201).json({
        message: "Canción creada exitosamente",
        cancion: c,
        generoUtilizado: genero,
    });
    } catch (e) {
    console.error("crearCancion", e);
    return res.status(500).json({ message: "Error al crear la canción" });
    }
};

/** GET /api/canciones */
export const obtenerCanciones = async (req: Request, res: Response) => {
    try {
    const { eventoId, genero, q, usuarioId } = req.query as any;

    const items = (await prisma.cancion.findMany({
        where: {
        eventoId: eventoId ? String(eventoId) : undefined,
        genero: genero
            ? { contains: String(genero), mode: "insensitive" }
            : undefined,
        titulo: q ? { contains: String(q), mode: "insensitive" } : undefined,
        },
        include: { votos: true },
        orderBy: { titulo: "asc" },
    })) as CancionConVotos[]; // aseguramos que TS conoce 'votos'

    const canciones = items.map((c) => {
        const votosUp = c.votos.filter((v) => v.tipo === TipoVoto.up).length;
        const votosDown = c.votos.filter((v) => v.tipo === TipoVoto.down).length;

        const votoUsuario = usuarioId
        ? c.votos.find((v) => v.usuarioId === String(usuarioId))
        : null;

        return {
        id: c.id,
        titulo: c.titulo,
        artista: c.artista,
        genero: c.genero,
        spotifyId: c.spotifyId,
        creadoEn: c.creadoEn,
        eventoId: c.eventoId,
        votosUp,
        votosDown,
        votoUsuario: votoUsuario
            ? { id: votoUsuario.id, tipo: votoUsuario.tipo }
            : null,
        };
    });

    return res.json({ canciones, total: canciones.length });
    } catch (e) {
    console.error("obtenerCanciones", e);
    return res.status(500).json({ message: "Error al obtener canciones" });
    }
};

/** GET /api/canciones/:id */
export const obtenerCancionPorId = async (req: Request, res: Response) => {
    try {
    const c = await prisma.cancion.findUnique({ where: { id: req.params.id } });
    if (!c) return res.status(404).json({ message: "Canción no encontrada" });
    return res.json({ cancion: c });
    } catch (e) {
    console.error("obtenerCancionPorId", e);
    return res.status(500).json({ message: "Error al obtener la canción" });
    }
};

/**
 * PUT /api/canciones/:id
 * - Si cambia el genero o el evento, re-validamos la regla
 */
export const actualizarCancion = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
    const { titulo, artista, genero, eventoId } = req.body || {};

    // Canción actual para conocer su evento si no viene en body
    const actual = await prisma.cancion.findUnique({
        where: { id },
        select: { eventoId: true },
    });
    if (!actual) {
        return res.status(404).json({ message: "Canción no encontrada" });
    }

    const eventoIdEfectivo = eventoId ?? actual.eventoId;

    if (genero !== undefined || eventoId !== undefined) {
        await assertGeneroCompatible(eventoIdEfectivo, genero ?? undefined);
    }

    // armamos el objeto 'data' tipado para que TS no subraye
    const data: Prisma.CancionUpdateInput = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (artista !== undefined) data.artista = artista;
    if (genero !== undefined) data.genero = genero;
    if (eventoId !== undefined) (data as any).eventoId = eventoId; // si eventoId es scalar FK en tu modelo

    const c = await prisma.cancion.update({
        where: { id },
        data,
    });

    return res.json({ message: "Canción actualizada exitosamente", cancion: c });
    } catch (e: any) {
    if (e?.code === "P2025") {
        return res.status(404).json({ message: "Canción no encontrada" });
    }
    if (e?.status) {
        return res.status(e.status).json({ message: e.message });
    }
    console.error("actualizarCancion", e);
    return res.status(500).json({ message: "Error al actualizar la canción" });
    }
};

/** DELETE /api/canciones/:id */
export const eliminarCancion = async (req: Request, res: Response) => {
    try {
    await prisma.cancion.delete({ where: { id: req.params.id } });
    return res.json({ message: "Canción eliminada exitosamente" });
    } catch (e: any) {
    if (e?.code === "P2025") {
        return res.status(404).json({ message: "Canción no encontrada" });
    }
    console.error("eliminarCancion", e);
    return res.status(500).json({ message: "Error al eliminar la canción" });
    } 
};

/** GET /api/canciones/tally/:id */
export const obtenerTallyCancion = async (req: Request, res: Response) => {
    try {
    const cancionId = req.params.id;

    const up = await prisma.voto.count({
        where: { cancionId, tipo: TipoVoto.up },
    });
    const down = await prisma.voto.count({
        where: { cancionId, tipo: TipoVoto.down },
    });

    return res.json({ cancionId, up, down, score: up - down });
    } catch (e) {
    console.error("obtenerTallyCancion", e);
    return res.status(500).json({ message: "Error al obtener el tally" });
    }
};

/**
 * POST /api/canciones/spotify
 * - Si no mandan genero, usa el del evento
 * - Si mandan genero, validar que coincida con el del evento
 */
export const crearCancionDesdeSpotify = async (req: Request, res: Response) => {
    try {
    const { eventoId, spotifyId } = req.body || {};
    let { genero } = req.body || {};

    if (!eventoId || !spotifyId) {
        return res
        .status(400)
        .json({ message: "eventoId y spotifyId son requeridos" });
    }

    const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
        select: { musica: true, nombre: true },
    });
    if (!evento) {
        return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (!genero) {
        genero = evento.musica;
        console.log(
        `🎵 Género automático obtenido del evento "${evento.nombre}": ${genero}`
        );
    } else {
        await assertGeneroCompatible(eventoId, genero);
    }

    const track = await getTrackById(spotifyId);
    if (!track) {
        return res.status(404).json({ message: "Spotify track no encontrado" });
    }

    const titulo = track?.name ?? "Sin título";
    const artista = (track?.artists ?? []).map((a: any) => a.name).join(" & ");

    // Evitar duplicar canción en mismo evento
    const existente = await prisma.cancion.findFirst({
        where: { eventoId, spotifyId },
    });
    if (existente) {
        return res.status(400).json({
        message: "Esta canción ya fue agregada a este evento",
        cancion: existente,
        });
    }

    const c = await prisma.cancion.create({
        data: { eventoId, titulo, artista, genero, spotifyId },
    });

    console.log(
        `✅ Canción agregada desde Spotify: "${titulo}" de ${artista} con género "${genero}"`
    );

    return res.status(201).json({
        message: "Canción agregada desde Spotify exitosamente",
        cancion: c,
        eventoNombre: evento.nombre,
        generoUtilizado: genero,
    });
    } catch (e: any) {
    console.error("❌ Error en crearCancionDesdeSpotify:", e);
    return res.status(500).json({
        message: e?.message ?? "Error al agregar canción desde Spotify",
        error: process.env.NODE_ENV === "development" ? e.message : undefined,
    });
    }
};

