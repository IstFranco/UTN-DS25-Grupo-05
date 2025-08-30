import { Request, Response } from 'express';
import { MusicStore } from '../data/musicStore.js';

export const crearVoto = async (req: Request, res: Response) => {
    try {
        const { cancionId, tipo, usuarioId } = req.body || {};
        if (!cancionId || (tipo !== 'up' && tipo !== 'down')) {
        return res.status(400).json({ message: "cancionId y tipo ('up'|'down') son requeridos" });
        }
        const r = MusicStore.createVoto({ cancionId, tipo, usuarioId });
        if ('error' in r) return res.status(404).json({ message: r.error });
        res.status(201).json({ message: 'Voto registrado', voto: r.voto, cancion: r.cancion });
    } catch (e) {
        console.error('crearVoto', e);
        res.status(500).json({ message: 'Error al registrar el voto' });
    }
};

export const obtenerVotos = async (req: Request, res: Response) => {
    try {
        const { cancionId } = req.query as any;
        const items = MusicStore.listVotos({ cancionId });
        res.json({ votos: items, total: items.length });
    } catch (e) {
        console.error('obtenerVotos', e);
        res.status(500).json({ message: 'Error al obtener votos' });
    }
};

export const eliminarVoto = async (req: Request, res: Response) => {
    try {
        const ok = MusicStore.deleteVoto(req.params.id);
        if (!ok) return res.status(404).json({ message: 'Voto no encontrado' });
        res.json({ message: 'Voto eliminado' });
    } catch (e) {
        console.error('eliminarVoto', e);
        res.status(500).json({ message: 'Error al eliminar voto' });
    }
};
