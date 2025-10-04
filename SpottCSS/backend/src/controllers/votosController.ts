import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';

// Crear o actualizar un voto (like/dislike)
export const crearVoto = async (req: Request, res: Response) => {
    try {
        const { cancionId, tipo, usuarioId } = req.body || {};
        
        if (!cancionId || !usuarioId || (tipo !== 'up' && tipo !== 'down')) {
            return res.status(400).json({ 
                message: "cancionId, usuarioId y tipo ('up'|'down') son requeridos" 
            });
        }

        console.log(`🗳️ Registrando voto: Usuario ${usuarioId} → Canción ${cancionId} → ${tipo}`);

        // Usa upsert: si ya existe voto de ese usuario en esa canción → actualiza, si no → crea
        const voto = await prisma.voto.upsert({
            where: { usuarioId_cancionId: { usuarioId, cancionId } },
            update: { tipo },
            create: { usuarioId, cancionId, tipo },
        });

        // Obtener conteos actualizados de la canción
        const [votosUp, votosDown] = await Promise.all([
            prisma.voto.count({ where: { cancionId, tipo: 'up' } }),
            prisma.voto.count({ where: { cancionId, tipo: 'down' } })
        ]);

        // Obtener la canción actualizada
        const cancion = await prisma.cancion.findUnique({
            where: { id: cancionId }
        });

        console.log(`✅ Voto registrado. Conteos: ${votosUp} up, ${votosDown} down`);

        res.status(201).json({ 
            message: 'Voto registrado', 
            voto,
            cancion: {
                ...cancion,
                votosUp,
                votosDown
            }
        });
    } catch (e) {
        console.error('❌ Error en crearVoto:', e);
        res.status(500).json({ message: 'Error al registrar el voto' });
    }
};

export const obtenerVotos = async (req: Request, res: Response) => {
    try {
        const { cancionId } = req.query as { cancionId?: string };
        
        const votos = await prisma.voto.findMany({
            where: cancionId ? { cancionId } : {},
            include: { 
                usuario: { select: { id: true, nombre: true } }, 
                cancion: { select: { id: true, titulo: true, artista: true } }
            },
        });

        res.json({ votos, total: votos.length });
    } catch (e) {
        console.error('❌ Error en obtenerVotos:', e);
        res.status(500).json({ message: 'Error al obtener votos' });
    }
};

// Eliminar un voto por id
export const eliminarVoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        console.log(`🗑️ Eliminando voto: ${id}`);

        // Obtener info del voto antes de eliminarlo (para los conteos)
        const voto = await prisma.voto.findUnique({
            where: { id },
            select: { cancionId: true, tipo: true }
        });

        if (!voto) {
            return res.status(404).json({ message: 'Voto no encontrado' });
        }

        // Eliminar el voto
        await prisma.voto.delete({ where: { id } });

        // Obtener conteos actualizados
        const [votosUp, votosDown] = await Promise.all([
            prisma.voto.count({ where: { cancionId: voto.cancionId, tipo: 'up' } }),
            prisma.voto.count({ where: { cancionId: voto.cancionId, tipo: 'down' } })
        ]);

        // Obtener la canción actualizada
        const cancion = await prisma.cancion.findUnique({
            where: { id: voto.cancionId }
        });

        console.log(`✅ Voto eliminado. Conteos actualizados: ${votosUp} up, ${votosDown} down`);

        res.json({ 
            message: 'Voto eliminado',
            cancion: {
                ...cancion,
                votosUp,
                votosDown
            }
        });
    } catch (e: any) {
        if (e.code === 'P2025') {
            return res.status(404).json({ message: 'Voto no encontrado' });
        }
        console.error('❌ Error en eliminarVoto:', e);
        res.status(500).json({ message: 'Error al eliminar voto' });
    }
};