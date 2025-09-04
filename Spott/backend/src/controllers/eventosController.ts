// src/controllers/eventosController.ts
import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';

// ---- Tipos auxiliares ----
// Alternativa más simple sin usar Prisma.InscripcionGetPayload
type InscripcionConEvento = {
    id: string;
    usuarioId: string;
    eventoId: string;
    tipoEntrada: 'general' | 'vip';
    estado: 'activa' | 'cancelada';
    fechaInscripcion: Date;
    evento: {
        id: string;
        nombre: string;
        descripcionLarga?: string | null;
        ciudad: string;
        barrio?: string | null;
        tematica?: string | null;
        musica: string;
        fecha: Date;
        precio?: number | null;
        cupoGeneral?: number | null;
        cupoVip?: number | null;
        portada?: string | null;
        imagenes: string[];
        activo: boolean;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        empresaId: string;
    };
};

type FiltrosEvento = {
    ciudad?: string;
    musica?: string;
    busqueda?: string;
    fechaDesde?: string;
    fechaHasta?: string;
};

type CrearEventoBody = {
    nombre: string;
    descripcionLarga?: string;
    ciudad: string;
    barrio?: string;
    tematica?: string;
    musica: string;
    fecha: string;
    precio?: string | number;
    cupoGeneral?: string | number;
    cupoVip?: string | number;
    empresaId: string;
};

// Utilidad para mapear al formato que tu front espera
const toFrontend = (e: any) => ({
    ...e,
    imageSrc: e.portada ?? '',
    title: e.nombre,
    description: `Temática: ${e.tematica ?? 'Sin temática'}, Música: ${e.musica}`,
    rating: (4 + Math.random()).toFixed(1),
});

export const crearEvento = async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const body = req.body as CrearEventoBody;

        // Validaciones básicas
        if (!body.nombre || !body.ciudad || !body.musica || !body.fecha || !body.empresaId) {
            return res.status(400).json({ 
                message: 'nombre, ciudad, musica, fecha y empresaId son requeridos' 
            });
        }

        // Manejo seguro de archivos
        const portada = files?.portada?.[0] ? `/uploads/${files.portada[0].filename}` : null;
        const imagenes = files?.imagenes?.map((f) => `/uploads/${f.filename}`) ?? [];

        const evento = await prisma.evento.create({
            data: {
                nombre: body.nombre,
                descripcionLarga: body.descripcionLarga || null,
                ciudad: body.ciudad,
                barrio: body.barrio || null,
                tematica: body.tematica || null,
                musica: body.musica,
                fecha: new Date(body.fecha),
                precio: body.precio ? Number(body.precio) : null,
                cupoGeneral: body.cupoGeneral ? Number(body.cupoGeneral) : null,
                cupoVip: body.cupoVip ? Number(body.cupoVip) : null,
                portada,
                imagenes,
                empresaId: body.empresaId,
            },
        });

        return res.status(201).json({ 
            message: 'Evento creado exitosamente', 
            evento: toFrontend(evento) 
        });
    } catch (e: any) {
        console.error('Error al crear evento:', e);
        if (e.code === 'P2003') {
            return res.status(400).json({ message: 'Empresa no válida' });
        }
        return res.status(500).json({ message: 'Error al crear el evento' });
    }
};

export const obtenerEventos = async (req: Request, res: Response) => {
    try {
        const q = req.query as FiltrosEvento;

        const whereClause: any = {
            activo: true,
        };

        if (q.ciudad) {
            whereClause.ciudad = { contains: q.ciudad, mode: 'insensitive' };
        }

        if (q.musica) {
            whereClause.musica = { contains: q.musica, mode: 'insensitive' };
        }

        if (q.busqueda) {
            whereClause.OR = [
                { nombre: { contains: q.busqueda, mode: 'insensitive' } },
                { descripcionLarga: { contains: q.busqueda, mode: 'insensitive' } },
            ];
        }

        if (q.fechaDesde) {
            whereClause.fecha = { ...whereClause.fecha, gte: new Date(q.fechaDesde) };
        }

        if (q.fechaHasta) {
            whereClause.fecha = { ...whereClause.fecha, lte: new Date(q.fechaHasta) };
        }

        const eventos = await prisma.evento.findMany({
            where: whereClause,
            orderBy: { fecha: 'asc' },
        });

        const data = eventos.map(toFrontend);
        return res.json({ eventos: data, total: data.length });
    } catch (e) {
        console.error('Error al obtener eventos:', e);
        return res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const obtenerEventoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evento = await prisma.evento.findFirst({ 
            where: { id, activo: true } 
        });
        
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        
        return res.json({ evento: toFrontend(evento) });
    } catch (e) {
        console.error('Error al obtener evento:', e);
        return res.status(500).json({ message: 'Error al obtener el evento' });
    }
};

export const actualizarEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const body = req.body as Partial<CrearEventoBody>;

        const portada = files?.portada?.[0] ? `/uploads/${files.portada[0].filename}` : undefined;
        const nuevasImgs = files?.imagenes?.map((f) => `/uploads/${f.filename}`);

        const updateData: any = {};
        
        if (body.nombre !== undefined) updateData.nombre = body.nombre;
        if (body.descripcionLarga !== undefined) updateData.descripcionLarga = body.descripcionLarga;
        if (body.ciudad !== undefined) updateData.ciudad = body.ciudad;
        if (body.barrio !== undefined) updateData.barrio = body.barrio;
        if (body.tematica !== undefined) updateData.tematica = body.tematica;
        if (body.musica !== undefined) updateData.musica = body.musica;
        if (body.fecha !== undefined) updateData.fecha = new Date(body.fecha);
        if (body.precio !== undefined) updateData.precio = body.precio ? Number(body.precio) : null;
        if (body.cupoGeneral !== undefined) updateData.cupoGeneral = body.cupoGeneral ? Number(body.cupoGeneral) : null;
        if (body.cupoVip !== undefined) updateData.cupoVip = body.cupoVip ? Number(body.cupoVip) : null;
        if (portada !== undefined) updateData.portada = portada;
        if (nuevasImgs !== undefined) updateData.imagenes = nuevasImgs;

        const evento = await prisma.evento.update({
            where: { id },
            data: updateData,
        });

        return res.json({ 
            message: 'Evento actualizado', 
            evento: toFrontend(evento) 
        });
    } catch (e: any) {
        console.error('Error al actualizar evento:', e);
        if (e.code === 'P2025') {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        return res.status(500).json({ message: 'Error al actualizar el evento' });
    }
};

export const eliminarEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.evento.update({ 
            where: { id }, 
            data: { activo: false } 
        });
        return res.json({ message: 'Evento eliminado exitosamente' });
    } catch (e: any) {
        console.error('Error al eliminar evento:', e);
        if (e.code === 'P2025') {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        return res.status(500).json({ message: 'Error al eliminar el evento' });
    }
};

export const obtenerEventosPorEmpresa = async (req: Request, res: Response) => {
    try {
        const { empresaId } = req.params;
        const eventos = await prisma.evento.findMany({
            where: { empresaId, activo: true },
            orderBy: { fecha: 'asc' },
        });
        const data = eventos.map(toFrontend);
        return res.json({ eventos: data, total: data.length });
    } catch (e) {
        console.error('Error al obtener eventos por empresa:', e);
        return res.status(500).json({ message: 'Error al obtener eventos de la empresa' });
    }
};

export const inscribirseEvento = async (req: Request, res: Response) => {
    try {
        const { id: eventoId } = req.params;
        const { usuarioId, tipoEntrada } = req.body as { usuarioId: string; tipoEntrada: 'general' | 'vip' };

        if (!usuarioId) {
            return res.status(400).json({ message: 'usuarioId es requerido' });
        }

        if (!['general', 'vip'].includes(tipoEntrada)) {
            return res.status(400).json({ message: "tipoEntrada debe ser 'general' o 'vip'" });
        }

        // Verificar si ya está inscrito - usando findFirst en lugar del constraint
        const inscripcionExistente = await prisma.inscripcion.findFirst({
            where: {
                usuarioId: usuarioId,
                eventoId: eventoId
            }
        });

        if (inscripcionExistente) {
            if (inscripcionExistente.estado === 'activa') {
                return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
            }
            
            // Si estaba cancelada, reactivamos
            const insc = await prisma.inscripcion.update({
                where: { id: inscripcionExistente.id },
                data: { 
                    estado: 'activa', 
                    tipoEntrada,
                    fechaInscripcion: new Date()
                }
            });
            return res.status(200).json({ message: 'Inscripción reactivada', inscripcion: insc });
        }

        const insc = await prisma.inscripcion.create({
            data: { eventoId, usuarioId, tipoEntrada },
        });

        return res.status(201).json({ message: 'Inscripción realizada', inscripcion: insc });
    } catch (e: any) {
        console.error('Error al inscribirse:', e);
        return res.status(500).json({ message: 'Error al inscribirse' });
    }
};

export const desinscribirseEvento = async (req: Request, res: Response) => {
    try {
        const { id: eventoId } = req.params;
        const { usuarioId } = req.body as { usuarioId: string };

        if (!usuarioId) {
            return res.status(400).json({ message: 'usuarioId es requerido' });
        }

        const inscActiva = await prisma.inscripcion.findFirst({
            where: { eventoId, usuarioId, estado: 'activa' },
        });

        if (!inscActiva) {
            return res.status(404).json({ message: 'Inscripción activa no encontrada' });
        }

        await prisma.inscripcion.update({
            where: { id: inscActiva.id },
            data: { estado: 'cancelada' },
        });

        return res.json({ message: 'Te has desinscrito del evento exitosamente' });
    } catch (e) {
        console.error('Error al desinscribirse:', e);
        return res.status(500).json({ message: 'Error al desinscribirse del evento' });
    }
};

export const obtenerEventosInscritos = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;

        const inscs = await prisma.inscripcion.findMany({
            where: { usuarioId, estado: 'activa' },
            include: { evento: true },
        }) as InscripcionConEvento[];
        
        const data = inscs.map((i) => toFrontend(i.evento));

        return res.json({ eventos: data, total: data.length });
    } catch (e) {
        console.error('Error al obtener eventos inscritos:', e);
        return res.status(500).json({ message: 'Error al obtener eventos inscritos' });
    }
};