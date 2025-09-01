// src/controllers/eventosController.ts
import { Request, Response } from 'express';
import type { Evento as EventoModel, Inscripcion } from '@prisma/client';
import { prisma } from '../data/prisma.js';

// ---- Tipos auxiliares ----
type InscripcionConEvento = Inscripcion & { evento: EventoModel };

type FiltrosEvento = {
    ciudad?: string;
    musica?: string;
    busqueda?: string;
    fechaDesde?: string | Date;
    fechaHasta?: string | Date;
    };

    type CrearEventoBody = {
    nombre: string;
    descripcionLarga?: string | null;
    ciudad: string;
    barrio?: string | null;
    tematica?: string | null;
    musica: string;
    fecha: string | Date;
    precio?: number | string | null;
    cupoGeneral?: number | string | null;
    cupoVip?: number | string | null;
    empresaId: string;
    // campos que llegan por multer
    portada?: string | null;
    imagenes?: string[];
    };

    // Utilidad para mapear al formato que tu front espera
    const toFrontend = (e: EventoModel) => ({
    ...e,
    imageSrc: e.portada ?? '',
    title: e.nombre,
    description: `Temática: ${e.tematica ?? 'Sin temática'}, Música: ${e.musica}`,
    rating: (4 + Math.random()).toFixed(1),
    });

    export const crearEvento = async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const body = req.body as CrearEventoBody;

    const portada = files?.portada?.[0] ? `/uploads/${files.portada[0].filename}` : null;
    const imagenes = files?.imagenes?.map((f) => `/uploads/${f.filename}`) ?? [];

    try {
        const evento = await prisma.evento.create({
        data: {
            nombre: body.nombre,
            descripcionLarga: body.descripcionLarga ?? null,
            ciudad: body.ciudad,
            barrio: body.barrio ?? null,
            tematica: body.tematica ?? null,
            musica: body.musica,
            fecha: new Date(body.fecha),
            precio: body.precio != null ? Number(body.precio) : null,
            cupoGeneral: body.cupoGeneral != null ? Number(body.cupoGeneral) : null,
            cupoVip: body.cupoVip != null ? Number(body.cupoVip) : null,
            portada,
            imagenes,
            empresa: { connect: { id: body.empresaId } },
        },
        });
        return res.status(201).json({ message: 'Evento creado exitosamente', evento: toFrontend(evento) });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al crear el evento' });
    }
    };

    export const obtenerEventos = async (req: Request, res: Response) => {
    const q = req.query as FiltrosEvento;

    try {
        const eventos = await prisma.evento.findMany({
        where: {
            activo: true,
            ciudad: q.ciudad ? { contains: q.ciudad, mode: 'insensitive' } : undefined,
            musica: q.musica ? { contains: q.musica, mode: 'insensitive' } : undefined,
            AND: [
            q.busqueda
                ? {
                    OR: [
                    { nombre: { contains: q.busqueda, mode: 'insensitive' } },
                    { descripcionLarga: { contains: q.busqueda, mode: 'insensitive' } },
                    ],
                }
                : {},
            q.fechaDesde ? { fecha: { gte: new Date(q.fechaDesde) } } : {},
            q.fechaHasta ? { fecha: { lte: new Date(q.fechaHasta) } } : {},
            ],
        },
        orderBy: { fecha: 'asc' },
        });

        const data = eventos.map(toFrontend);
        return res.json({ eventos: data, total: data.length });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al obtener eventos' });
    }
    };

    export const obtenerEventoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const evento = await prisma.evento.findFirst({ where: { id, activo: true } });
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado' });
    return res.json({ evento: toFrontend(evento) });
    };

    export const actualizarEvento = async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const body = req.body as Partial<CrearEventoBody>;

    const portada = files?.portada?.[0] ? `/uploads/${files.portada[0].filename}` : undefined;
    const nuevasImgs: string[] | undefined = files?.imagenes?.map((f) => `/uploads/${f.filename}`);

    try {
        const evento = await prisma.evento.update({
        where: { id },
        data: {
            nombre: body.nombre,
            descripcionLarga: body.descripcionLarga ?? undefined,
            ciudad: body.ciudad,
            barrio: body.barrio ?? undefined,
            tematica: body.tematica ?? undefined,
            musica: body.musica,
            fecha: body.fecha ? new Date(body.fecha) : undefined,
            precio: body.precio != null ? Number(body.precio) : undefined,
            cupoGeneral: body.cupoGeneral != null ? Number(body.cupoGeneral) : undefined,
            cupoVip: body.cupoVip != null ? Number(body.cupoVip) : undefined,
            portada,
            imagenes: nuevasImgs ?? undefined,
        },
        });
        return res.json({ message: 'Evento actualizado', evento: toFrontend(evento) });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al actualizar el evento' });
    }
    };

    export const eliminarEvento = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.evento.update({ where: { id }, data: { activo: false } });
        return res.json({ message: 'Evento eliminado exitosamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al eliminar el evento' });
    }
    };

    export const obtenerEventosPorEmpresa = async (req: Request, res: Response) => {
    const { empresaId } = req.params;
    const eventos = await prisma.evento.findMany({
        where: { empresaId, activo: true },
        orderBy: { fecha: 'asc' },
    });
    const data = eventos.map(toFrontend);
    return res.json({ eventos: data, total: data.length });
    };

    export const inscribirseEvento = async (req: Request, res: Response) => {
    const { id: eventoId } = req.params;
    const { usuarioId, tipoEntrada } = req.body as { usuarioId: string; tipoEntrada: 'general' | 'vip' };

    try {
        const insc = await prisma.inscripcion.create({
        data: { eventoId, usuarioId, tipoEntrada },
        });
        return res.status(201).json({ message: 'Inscripción realizada', inscripcion: insc });
    } catch (e: any) {
        if (e.code === 'P2002') {
        return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
        }
        console.error(e);
        return res.status(500).json({ message: 'Error al inscribirse' });
    }
    };

    export const desinscribirseEvento = async (req: Request, res: Response) => {
    const { id: eventoId } = req.params;
    const { usuarioId } = req.body as { usuarioId: string };

    try {
        const inscActiva = await prisma.inscripcion.findFirst({
        where: { eventoId, usuarioId, estado: 'activa' },
        });
        if (!inscActiva) return res.status(404).json({ message: 'Inscripción no encontrada' });

        await prisma.inscripcion.update({
        where: { id: inscActiva.id },
        data: { estado: 'cancelada' },
        });
        return res.json({ message: 'Te has desinscrito del evento exitosamente' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al desinscribirse del evento' });
    }
    };

    export const obtenerEventosInscritos = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;

    const inscs = await prisma.inscripcion.findMany({
        where: { usuarioId, estado: 'activa' },
        include: { evento: true },
    });

    const data = (inscs as InscripcionConEvento[]).map((i) => toFrontend(i.evento));
    return res.json({ eventos: data, total: data.length });
};
