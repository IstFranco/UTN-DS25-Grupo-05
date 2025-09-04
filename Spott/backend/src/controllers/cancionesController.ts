import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';
import { getTrackById } from '../spotify/spotifyService.js';

export const crearCancion = async (req: Request, res: Response) => {
    try {
        const { eventoId, titulo, artista, spotifyId } = req.body || {};
        let { genero } = req.body || {};
        
        if (!eventoId || !titulo || !artista) {
            return res.status(400).json({ message: 'eventoId, titulo y artista son requeridos' });
        }

        // Si no se especifica género, obtenerlo automáticamente del evento
        if (!genero) {
            const evento = await prisma.evento.findUnique({
                where: { id: eventoId },
                select: { musica: true, nombre: true }
            });

            if (!evento) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            genero = evento.musica;
            console.log(`🎵 Género automático obtenido del evento "${evento.nombre}": ${genero}`);
        }

        const c = await prisma.cancion.create({
            data: { eventoId, titulo, artista, genero, spotifyId }
        });

        res.status(201).json({ 
            message: 'Canción creada exitosamente', 
            cancion: c,
            generoUtilizado: genero 
        });
    } catch (e) {
        console.error('crearCancion', e);
        res.status(500).json({ message: 'Error al crear la canción' });
    }
};

export const obtenerCanciones = async (req: Request, res: Response) => {
    try {
        const { eventoId, genero, q, usuarioId } = req.query as any;
        
        const items = await prisma.cancion.findMany({
            where: {
                eventoId: eventoId ? String(eventoId) : undefined,
                genero: genero ? { contains: String(genero), mode: 'insensitive' } : undefined,
                titulo: q ? { contains: String(q), mode: 'insensitive' } : undefined,
            },
            include: {
                votos: true // Incluir todos los votos de cada canción
            }
        });

        // Procesar cada canción para calcular votos y encontrar el voto del usuario
        const canciones = items.map(cancion => {
            const votosUp = cancion.votos.filter(v => v.tipo === 'up').length;
            const votosDown = cancion.votos.filter(v => v.tipo === 'down').length;
            
            // Encontrar el voto del usuario actual (si existe)
            const votoUsuario = usuarioId ? 
                cancion.votos.find(v => v.usuarioId === usuarioId) : null;
            
            return {
                id: cancion.id,
                titulo: cancion.titulo,
                artista: cancion.artista,
                genero: cancion.genero,
                spotifyId: cancion.spotifyId,
                creadoEn: cancion.creadoEn,
                eventoId: cancion.eventoId,
                votosUp,
                votosDown,
                votoUsuario: votoUsuario ? {
                    id: votoUsuario.id,
                    tipo: votoUsuario.tipo
                } : null
            };
        });

        console.log(`📊 Devolviendo ${canciones.length} canciones con votos para evento ${eventoId}`);
        res.json({ canciones, total: canciones.length });
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
        const { eventoId, spotifyId } = req.body || {};
        let { genero } = req.body || {};
        
        if (!eventoId || !spotifyId) {
            return res.status(400).json({ message: 'eventoId y spotifyId son requeridos' });
        }

        // Obtener información del evento SIEMPRE (para el género)
        const evento = await prisma.evento.findUnique({
            where: { id: eventoId },
            select: { musica: true, nombre: true }
        });

        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Si no se especifica género, usar el del evento automáticamente
        if (!genero) {
            genero = evento.musica;
            console.log(`🎵 Género automático obtenido del evento "${evento.nombre}": ${genero}`);
        }

        // Obtener información de la canción desde Spotify
        const track = await getTrackById(spotifyId);
        if (!track) {
            return res.status(404).json({ message: 'Spotify track no encontrado' });
        }

        const titulo = track?.name ?? 'Sin título'; 
        const artista = (track?.artists ?? []).map((a: any) => a.name).join(' & ');

        // Verificar si la canción ya existe en este evento
        const cancionExistente = await prisma.cancion.findFirst({
            where: {
                eventoId,
                spotifyId,
            }
        });

        if (cancionExistente) {
            return res.status(400).json({ 
                message: 'Esta canción ya fue agregada a este evento',
                cancion: cancionExistente 
            });
        }

        const c = await prisma.cancion.create({
            data: { 
                eventoId, 
                titulo, 
                artista, 
                genero,
                spotifyId 
            }
        });

        console.log(`✅ Canción creada desde Spotify: "${titulo}" de ${artista} con género "${genero}"`);

        res.status(201).json({ 
            message: 'Canción creada desde Spotify exitosamente', 
            cancion: c,
            eventoNombre: evento.nombre,
            generoUtilizado: genero
        });
    } catch (e: any) {
        console.error('❌ Error en crearCancionDesdeSpotify:', e);
        res.status(500).json({ 
            message: e?.message ?? 'Error al crear canción desde Spotify',
            error: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
};