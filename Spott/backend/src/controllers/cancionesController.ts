import { Request, Response } from 'express';
import { MusicStore } from '../data/musicStore.js';
import { getTrackById } from '../spotify/spotifyService.js';

export const crearCancion = async (req: Request, res: Response) => {
    try {
        const { eventoId, nombre, artista, genero, spotifyId } = req.body || {};
        if (!eventoId || !nombre || !artista) {
        return res.status(400).json({ message: 'eventoId, nombre y artista son requeridos' });
        }
        const c = MusicStore.createCancion({ eventoId, nombre, artista, genero, spotifyId });
        res.status(201).json({ message: 'Canción creada exitosamente', cancion: c });
    } catch (e) {
        console.error('crearCancion', e);
        res.status(500).json({ message: 'Error al crear la canción' });
    }
};

export const obtenerCanciones = async (req: Request, res: Response) => {
    try {
        const { eventoId, genero, q } = req.query as any;
        const items = MusicStore.listCanciones({ eventoId, genero, q });
        res.json({ canciones: items, total: items.length });
    } catch (e) {
        console.error('obtenerCanciones', e);
        res.status(500).json({ message: 'Error al obtener canciones' });
    }
};

export const obtenerCancionPorId = async (req: Request, res: Response) => {
    try {
        const c = MusicStore.getCancion(req.params.id);
        if (!c) return res.status(404).json({ message: 'Canción no encontrada' });
        res.json({ cancion: c });
    } catch (e) {
        console.error('obtenerCancionPorId', e);
        res.status(500).json({ message: 'Error al obtener la canción' });
    }
};

export const actualizarCancion = async (req: Request, res: Response) => {
    try {
        const { nombre, artista, genero } = req.body || {};
        const c = MusicStore.updateCancion(req.params.id, { nombre, artista, genero });
        if (!c) return res.status(404).json({ message: 'Canción no encontrada' });
        res.json({ message: 'Canción actualizada exitosamente', cancion: c });
    } catch (e) {
        console.error('actualizarCancion', e);
        res.status(500).json({ message: 'Error al actualizar la canción' });
    }
};

export const eliminarCancion = async (req: Request, res: Response) => {
    try {
        const ok = MusicStore.softDeleteCancion(req.params.id);
        if (!ok) return res.status(404).json({ message: 'Canción no encontrada' });
        res.json({ message: 'Canción eliminada exitosamente' });
    } catch (e) {
        console.error('eliminarCancion', e);
        res.status(500).json({ message: 'Error al eliminar la canción' });
    }
};

export const obtenerTallyCancion = async (req: Request, res: Response) => {
    try {
        const c = MusicStore.getCancion(req.params.id);
        if (!c) return res.status(404).json({ message: 'Canción no encontrada' });
        res.json({ cancionId: c.id, up: c.votosUp, down: c.votosDown, score: c.votosUp - c.votosDown });
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

        const nombre = track?.name ?? 'Sin título';
        const artista = (track?.artists ?? []).map((a: any) => a.name).join(' & ');

        const c = MusicStore.createCancion({
        eventoId,
        nombre,
        artista,
        genero,                 // opcional (podés pasar el del evento)
        spotifyId
        });

        res.status(201).json({ message: 'Canción creada desde Spotify', cancion: c });
    } catch (e: any) {
        console.error('crearCancionDesdeSpotify', e);
        res.status(500).json({ message: e?.message ?? 'Error al crear desde Spotify' });
    }
};
