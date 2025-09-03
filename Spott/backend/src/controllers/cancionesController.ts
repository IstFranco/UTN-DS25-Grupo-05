import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';
import { getTrackById } from '../spotify/spotifyService.js';

export const crearCancion = async (req: Request, res: Response) => {
    try {
        const { eventoId, titulo, artista, genero, spotifyId } = req.body || {};
        if (!eventoId || !titulo || !artista) {
        return res.status(400).json({ message: 'eventoId, titulo y artista son requeridos' });
        }
        const c = await prisma.cancion.create({
            data: { eventoId, titulo, artista, genero, spotifyId }
        });
        res.status(201).json({ message: 'Canción creada exitosamente', cancion: c });
    } catch (e) {
        console.error('crearCancion', e);
        res.status(500).json({ message: 'Error al crear la canción' });
    }
};

export const obtenerCanciones = async (req: Request, res: Response) => {
    try {
        const { eventoId, genero, q } = req.query as any;
        const items = await prisma.cancion.findMany({
            where: {
                eventoId: eventoId ? String(eventoId) : undefined,
                genero: genero ? { contains: String(genero), mode: 'insensitive' } : undefined,
                titulo: q ? { contains: String(q), mode: 'insensitive' } : undefined,
            }
        });
        res.json({ canciones: items, total: items.length });
    } catch (e) {
        console.error('obtenerCanciones', e);
        res.status(500).json({ message: 'Error al obtener canciones' });
    }
};

export const obtenerCancionPorId = async (req: Request, res: Response) => {
    try {
        const c = await prisma.cancion.findUnique({ where: { id: req.params.id } });
        if (!c) return res.status(404).json({ message: 'Canción no encontrada' });
        res.json({ cancion: c });
    } catch (e) {
        console.error('obtenerCancionPorId', e);
        res.status(500).json({ message: 'Error al obtener la canción' });
    }
};

export const actualizarCancion = async (req: Request, res: Response) => {
    try {
        const { titulo, artista, genero } = req.body || {};
        const c = await prisma.cancion.update({
            where: { id: req.params.id },
            data: { titulo, artista, genero }
        });

        res.json({ message: 'Canción actualizada exitosamente', cancion: c });
    } catch (e: any) {
        if (e.code === 'P2025') {
        // Prisma no encontró ningún registro con ese id
        return res.status(404).json({ message: 'Canción no encontrada' });
        }
        console.error('actualizarCancion', e);
        res.status(500).json({ message: 'Error al actualizar la canción' });
    }
};

export const eliminarCancion = async (req: Request, res: Response) => {
    try {
        await prisma.cancion.delete({ where: { id: req.params.id } });
        res.json({ message: 'Canción eliminada exitosamente' });
    } catch (e: any) {
        if (e.code === 'P2025') {
        return res.status(404).json({ message: 'Canción no encontrada' });
        }
        console.error('eliminarCancion', e);
        res.status(500).json({ message: 'Error al eliminar la canción' });
    }
};

export const obtenerTallyCancion = async (req: Request, res: Response) => {
    try {
        const cancionId = req.params.id;

        const up = await prisma.voto.count({
        where: { cancionId, tipo: 'up' },
        });

        const down = await prisma.voto.count({
        where: { cancionId, tipo: 'down' },
        });

        res.json({ cancionId, up, down, score: up - down });
    } catch (e) {
        console.error('obtenerTallyCancion', e);
        res.status(500).json({ message: 'Error al obtener el tally' });
    }
};

export const crearCancionDesdeSpotify = async (req: Request, res: Response) => {
    try {
        const { eventoId, spotifyId, genero } = req.body || {};
        if (!eventoId || !spotifyId) {
            return res.status(400).json({ message: 'eventoId y spotifyId son requeridos' });
        }
        const track = await getTrackById(spotifyId);
        if (!track) return res.status(404).json({ message: 'Spotify track no encontrado' });

        const titulo = track?.name ?? 'Sin título'; 
        const artista = (track?.artists ?? []).map((a: any) => a.name).join(' & ');

        const c = await prisma.cancion.create({
            data: { eventoId, titulo, artista, genero, spotifyId }
        });

        res.status(201).json({ message: 'Canción creada desde Spotify', cancion: c });
    } catch (e: any) {
        console.error('crearCancionDesdeSpotify', e);
        res.status(500).json({ message: e?.message ?? 'Error al crear desde Spotify' });
    }
};
