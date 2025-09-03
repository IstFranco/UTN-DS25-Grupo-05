import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';

// Crear o actualizar un voto (like/dislike)
export const crearVoto = async (req: Request, res: Response) => {
    try {
        const { cancionId, tipo, usuarioId } = req.body || {};

        if (!cancionId || !usuarioId || (tipo !== 'up' && tipo !== 'down')) {
        return res.status(400).json({ message: "cancionId, usuarioId y tipo ('up'|'down') son requeridos" });
        }

        // Usa upsert: si ya existe voto de ese usuario en esa canción → actualiza, si no → crea
        const voto = await prisma.voto.upsert({
        where: { usuarioId_cancionId: { usuarioId, cancionId } },
        update: { tipo },
        create: { usuarioId, cancionId, tipo },
        });

        res.status(201).json({ message: 'Voto registrado', voto });
    } catch (e) {
        console.error('crearVoto', e);
        res.status(500).json({ message: 'Error al registrar el voto' });
    }
};

export const obtenerVotos = async (req: Request, res: Response) => {
    try {
        const { cancionId } = req.query as { cancionId?: string };

        const votos = await prisma.voto.findMany({
            where: cancionId ? { cancionId } : {},
            include: { usuario: true, cancion: true }, //? opcional: traer datos relacionados, esto no se si hace falta, pero lo dejo comentado para discutirlo.
        });

    res.json({ votos, total: votos.length });
    } catch (e) {
        console.error('obtenerVotos', e);
        res.status(500).json({ message: 'Error al obtener votos' });
    }
};

// Eliminar un voto por id
export const eliminarVoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.voto.delete({ where: { id } });

        res.json({ message: 'Voto eliminado' });
    } catch (e: any) {
        if (e.code === 'P2025') {
        return res.status(404).json({ message: 'Voto no encontrado' });
        }
        console.error('eliminarVoto', e);
        res.status(500).json({ message: 'Error al eliminar voto' });
    }
};
