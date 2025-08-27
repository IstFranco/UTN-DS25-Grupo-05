import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { Evento, CrearEventoDTO, FiltrosEvento, Inscripcion } from '../types/index.js';

// Simulamos una base de datos en memoria (en producción usar una DB real)
let eventos: Evento[] = [];
let inscripciones: Inscripcion[] = [];

// Función auxiliar para crear el objeto compatible con el frontend
const formatearEventoParaFrontend = (evento: Evento): Evento => {
    return {
        ...evento,
        imageSrc: evento.portada,
        title: evento.nombre,
        description: `Temática: ${evento.tematica || 'Sin temática'}, Música: ${evento.musica}`,
        rating: (4 + Math.random()).toFixed(1)
    };
};

export const crearEvento = async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const datos: CrearEventoDTO = req.body;

        // Procesar imagen de portada
        let portadaUrl = '';
        if (files.portada && files.portada[0]) {
            portadaUrl = `/uploads/${files.portada[0].filename}`;
        }

        // Procesar galería de imágenes
        let imagenesUrls: string[] = [];
        if (files.imagenes) {
            imagenesUrls = files.imagenes.map(file => `/uploads/${file.filename}`);
        }

        const nuevoEvento: Evento = {
            id: uuidv4(),
            ...datos,
            portada: portadaUrl,
            imagenes: imagenesUrls,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            activo: true,
            // Campos para compatibilidad con frontend
            imageSrc: portadaUrl,
            title: datos.nombre,
            description: `Temática: ${datos.tematica || 'Sin temática'}, Música: ${datos.musica}`,
            rating: (4 + Math.random()).toFixed(1)
        };

        eventos.push(nuevoEvento);

        res.status(201).json({
            message: 'Evento creado exitosamente',
            evento: formatearEventoParaFrontend(nuevoEvento)
        });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error al crear el evento' });
    }
};

export const obtenerEventos = async (req: Request, res: Response) => {
    try {
        const filtros: FiltrosEvento = req.query;
        let eventosFiltrados = eventos.filter(evento => evento.activo);

        // Aplicar filtros
        if (filtros.ciudad) {
            eventosFiltrados = eventosFiltrados.filter(evento => 
                evento.ciudad.toLowerCase().includes(filtros.ciudad!.toLowerCase())
            );
        }

        if (filtros.musica) {
            eventosFiltrados = eventosFiltrados.filter(evento => 
                evento.musica.toLowerCase().includes(filtros.musica!.toLowerCase())
            );
        }

        if (filtros.busqueda) {
            eventosFiltrados = eventosFiltrados.filter(evento => 
                evento.nombre.toLowerCase().includes(filtros.busqueda!.toLowerCase()) ||
                evento.descripcionLarga?.toLowerCase().includes(filtros.busqueda!.toLowerCase())
            );
        }

        if (filtros.fechaDesde) {
            eventosFiltrados = eventosFiltrados.filter(evento => 
                new Date(evento.fecha) >= new Date(filtros.fechaDesde!)
            );
        }

        if (filtros.fechaHasta) {
            eventosFiltrados = eventosFiltrados.filter(evento => 
                new Date(evento.fecha) <= new Date(filtros.fechaHasta!)
            );
        }

        const eventosFormateados = eventosFiltrados.map(formatearEventoParaFrontend);

        res.json({
            eventos: eventosFormateados,
            total: eventosFormateados.length
        });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const obtenerEventoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evento = eventos.find(e => e.id === id && e.activo);

        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ evento: formatearEventoParaFrontend(evento) });
    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ message: 'Error al obtener el evento' });
    }
};

export const obtenerEventosPorEmpresa = async (req: Request, res: Response) => {
    try {
        const { empresaId } = req.params;
        const eventosEmpresa = eventos
            .filter(evento => evento.empresaId === empresaId)
            .map(formatearEventoParaFrontend);

        res.json({
            eventos: eventosEmpresa,
            total: eventosEmpresa.length
        });
    } catch (error) {
        console.error('Error al obtener eventos de empresa:', error);
        res.status(500).json({ message: 'Error al obtener eventos de la empresa' });
    }
};

export const actualizarEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const datos = req.body;

        const eventoIndex = eventos.findIndex(e => e.id === id);
        if (eventoIndex === -1) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Actualizar imágenes si se proporcionan nuevas
        if (files.portada && files.portada[0]) {
            datos.portada = `/uploads/${files.portada[0].filename}`;
            datos.imageSrc = datos.portada;
        }

        if (files.imagenes) {
            datos.imagenes = files.imagenes.map((file: Express.Multer.File) => `/uploads/${file.filename}`);
        }

        eventos[eventoIndex] = {
            ...eventos[eventoIndex],
            ...datos,
            fechaActualizacion: new Date(),
            title: datos.nombre || eventos[eventoIndex].nombre,
            description: `Temática: ${datos.tematica || eventos[eventoIndex].tematica}, Música: ${datos.musica || eventos[eventoIndex].musica}`
        };

        res.json({
            message: 'Evento actualizado exitosamente',
            evento: formatearEventoParaFrontend(eventos[eventoIndex])
        });
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error al actualizar el evento' });
    }
};

export const eliminarEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventoIndex = eventos.findIndex(e => e.id === id);

        if (eventoIndex === -1) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Soft delete - marcar como inactivo
        eventos[eventoIndex].activo = false;
        eventos[eventoIndex].fechaActualizacion = new Date();

        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar el evento' });
    }
};

export const inscribirseEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { usuarioId, tipoEntrada = 'general' } = req.body;

        const evento = eventos.find(e => e.id === id && e.activo);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Verificar si ya está inscrito
        const inscripcionExistente = inscripciones.find(i => 
            i.eventoId === id && i.usuarioId === usuarioId && i.estado === 'activa'
        );

        if (inscripcionExistente) {
            return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
        }

        const nuevaInscripcion: Inscripcion = {
            id: uuidv4(),
            usuarioId,
            eventoId: id,
            tipoEntrada: tipoEntrada as 'general' | 'vip',
            estado: 'activa',
            fechaInscripcion: new Date()
        };

        inscripciones.push(nuevaInscripcion);

        res.status(201).json({
            message: 'Inscripción realizada exitosamente',
            inscripcion: nuevaInscripcion
        });
    } catch (error) {
        console.error('Error al inscribirse:', error);
        res.status(500).json({ message: 'Error al inscribirse al evento' });
    }
};

export const desinscribirseEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { usuarioId } = req.body;

        const inscripcionIndex = inscripciones.findIndex(i => 
            i.eventoId === id && i.usuarioId === usuarioId && i.estado === 'activa'
        );

        if (inscripcionIndex === -1) {
            return res.status(404).json({ message: 'Inscripción no encontrada' });
        }

        inscripciones[inscripcionIndex].estado = 'cancelada';

        res.json({ message: 'Te has desinscrito del evento exitosamente' });
    } catch (error) {
        console.error('Error al desinscribirse:', error);
        res.status(500).json({ message: 'Error al desinscribirse del evento' });
    }
};

export const obtenerEventosInscritos = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;

        const inscripcionesUsuario = inscripciones.filter(i => 
            i.usuarioId === usuarioId && i.estado === 'activa'
        );

        const eventosInscritos = inscripcionesUsuario
            .map(inscripcion => {
                const evento = eventos.find(e => e.id === inscripcion.eventoId && e.activo);
                return evento ? formatearEventoParaFrontend(evento) : null;
            })
            .filter(evento => evento !== null);

        res.json({
            eventos: eventosInscritos,
            total: eventosInscritos.length
        });
    } catch (error) {
        console.error('Error al obtener eventos inscritos:', error);
        res.status(500).json({ message: 'Error al obtener eventos inscritos' });
    }
};
