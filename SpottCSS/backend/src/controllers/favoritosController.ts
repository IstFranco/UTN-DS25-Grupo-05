// src/controllers/favoritosController.ts
import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';

export const agregarFavorito = async (req: Request, res: Response) => {
    try {
        const { usuarioId, eventoId } = req.body;

        const favoritoExistente = await prisma.favorito.findUnique({
            where: { usuarioId_eventoId: { usuarioId, eventoId } }
        });

        if (favoritoExistente) {
            return res.status(400).json({ message: 'Ya está en favoritos' });
        }

        const favorito = await prisma.favorito.create({
            data: { usuarioId, eventoId }
        });

        return res.status(201).json({ message: 'Agregado a favoritos', favorito });
    } catch (error) {
        console.error('Error al agregar favorito:', error);
        return res.status(500).json({ message: 'Error al agregar favorito' });
    }
};

export const verificarFavorito = async (req: Request, res: Response) => {
    try {
        const { eventoId, usuarioId } = req.params;
        const favorito = await prisma.favorito.findUnique({
            where: { usuarioId_eventoId: { usuarioId, eventoId } }
        });
        return res.json({ esFavorito: !!favorito });
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        return res.status(500).json({ message: 'Error al verificar favorito' });
    }
};

export const eliminarFavorito = async (req: Request, res: Response) => {
    try {
        const { eventoId, usuarioId } = req.params;
        await prisma.favorito.delete({
            where: { usuarioId_eventoId: { usuarioId, eventoId } }
        });
        return res.json({ message: 'Eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        return res.status(500).json({ message: 'Error al eliminar favorito' });
    }
};

export const obtenerFavoritos = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;
        const favoritos = await prisma.favorito.findMany({
            where: { usuarioId },
            include: { evento: true }
        });
        const eventos = favoritos.map(f => f.evento);
        return res.json({ eventos, total: eventos.length });
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        return res.status(500).json({ message: 'Error al obtener favoritos' });
    }
};