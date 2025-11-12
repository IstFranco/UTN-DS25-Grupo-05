// src/controllers/eventosController.ts
import { Request, Response } from 'express';
import { z, ZodIssue } from 'zod';
import { prisma } from '../data/prisma.js';
import { 
    crearEventoSchema, 
    actualizarEventoSchema, 
    filtrosEventoSchema, 
    inscripcionSchema 
} from '../validations/eventoSchemas.js';

// --- NUEVAS IMPORTACIONES ---
import { supabase } from '../data/supabaseClient.js'; // Asegúrate que esta ruta sea correcta
import path from 'path';

// --- NUEVA CONSTANTE ---
const BUCKET_NAME = 'Eventos';

// ---- Tipos auxiliares ----
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
        precioVip?: number | null;
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

// Utilidad para mapear al formato que tu front espera
const toFrontend = (e: any) => ({
    ...e,
    
    // Campos que el frontend espera específicamente
    id: e.id,
    imageSrc: e.portada ?? '',
    title: e.nombre,
    description: e.descripcionLarga || `Temática: ${e.tematica ?? 'Sin temática'}, Música: ${e.musica}`,
    rating: (4 + Math.random()).toFixed(1),
    ciudad: e.ciudad,
    barrio: e.barrio,
    tematica: e.tematica,
    musica: e.musica,
    fecha: e.fecha,
    precio: e.precio,
    precioVip: e.precioVip,
    cupoGeneral: e.cupoGeneral,
    cupoVip: e.cupoVip,
    imagenes: e.imagenes || [],
    
    // Calcular inscriptos dinámicamente
    inscriptos: e._count?.inscripciones || 0
});

// --- NUEVA FUNCIÓN AUXILIAR ---
/**
 * Sube un archivo a Supabase Storage y devuelve la URL pública.
 * @param file El archivo (Express.Multer.File) que viene de memoryStorage
 * @returns La URL pública del archivo subido
 */
const uploadFileToSupabase = async (file: Express.Multer.File): Promise<string> => {
    // 1. Crear un nombre de archivo único
    const fileExtension = path.extname(file.originalname);
    const fileName = `evento-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

    // 2. Subir el archivo (usamos file.buffer que viene de memoryStorage)
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        console.error('Error subiendo archivo a Supabase:', error);
        throw new Error(`Error al subir archivo: ${error.message}`);
    }

    // 3. Obtener la URL pública
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    if (!data.publicUrl) {
        console.error('Error obteniendo URL pública de Supabase');
        throw new Error('No se pudo obtener la URL pública después de la subida.');
    }

    return data.publicUrl;
};
// --- FIN DE LA FUNCIÓN AUXILIAR ---


export const crearEvento = async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        // Validar datos del formulario con Zod
        const validatedData = crearEventoSchema.parse(req.body);

        // --- CAMBIO AQUÍ: Manejo de archivos con Supabase ---
        let portadaUrl: string | null = null;
        let imagenesUrls: string[] = [];

        // 1. Subir portada si existe
        if (files?.portada?.[0]) {
            console.log('Subiendo portada a Supabase...');
            portadaUrl = await uploadFileToSupabase(files.portada[0]);
            console.log('Portada subida:', portadaUrl);
        }

        // 2. Subir galería de imágenes si existen
        if (files?.imagenes && files.imagenes.length > 0) {
            console.log(`Subiendo ${files.imagenes.length} imágenes de galería a Supabase...`);
            // Usamos Promise.all para subirlas en paralelo (mucho más rápido)
            imagenesUrls = await Promise.all(
                files.imagenes.map(file => uploadFileToSupabase(file))
            );
            console.log('Imágenes de galería subidas:', imagenesUrls);
        }
        // --- FIN DEL CAMBIO DE SUBIDA ---

        const evento = await prisma.evento.create({
            data: {
                nombre: validatedData.nombre,
                descripcionLarga: validatedData.descripcionLarga || null,
                ciudad: validatedData.ciudad,
                barrio: validatedData.barrio || null,
                tematica: validatedData.tematica || null,
                musica: validatedData.musica,
                fecha: validatedData.fecha,
                horaInicio: validatedData.horaInicio || null,
                precio: validatedData.precio || null,
                precioVip: validatedData.precioVip || null,
                cupoGeneral: validatedData.cupoGeneral || null,
                cupoVip: validatedData.cupoVip || null,
                edadMinima: validatedData.edadMinima || null,
                estilo: validatedData.estilo || null,
                accesible: validatedData.accesible,
                linkExterno: validatedData.linkExterno || null,
                politicaCancelacion: validatedData.politicaCancelacion || null,
                hashtag: validatedData.hashtag || null,
                // --- CAMBIO AQUÍ: Guardamos las URLs de Supabase ---
                portada: portadaUrl,
                imagenes: imagenesUrls,
                // --- FIN DEL CAMBIO ---
                empresaId: validatedData.empresaId,
            },
        });

        return res.status(201).json({ 
            message: 'Evento creado exitosamente', 
            evento: toFrontend(evento) 
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: e.errors
            });
        }
        console.error('Error al crear evento:', e);
        if (e.code === 'P2003') {
            return res.status(400).json({ message: 'Empresa no válida' });
        }
        return res.status(500).json({ message: 'Error al crear el evento' });
    }
};

export const obtenerEventos = async (req: Request, res: Response) => {
    try {
        // Validar filtros con Zod
        const validatedData = filtrosEventoSchema.parse(req.query);

        const whereClause: any = {
            activo: true,
        };

        if (validatedData.ciudad) {
            whereClause.ciudad = { contains: validatedData.ciudad, mode: 'insensitive' };
        }

        if (validatedData.musica) {
            whereClause.musica = { contains: validatedData.musica, mode: 'insensitive' };
        }

        if (validatedData.busqueda) {
            whereClause.OR = [
                { nombre: { contains: validatedData.busqueda, mode: 'insensitive' } },
                { descripcionLarga: { contains: validatedData.busqueda, mode: 'insensitive' } },
            ];
        }

        if (validatedData.fechaDesde) {
            whereClause.fecha = { ...whereClause.fecha, gte: validatedData.fechaDesde };
        }

        if (validatedData.fechaHasta) {
            whereClause.fecha = { ...whereClause.fecha, lte: validatedData.fechaHasta };
        }

        const eventos = await prisma.evento.findMany({
            where: whereClause,
            orderBy: { fecha: 'asc' },
            include: {
                _count: {
                    select: { 
                        inscripciones: { 
                            where: { estado: 'activa' } 
                        } 
                    }
                }
            }
        });

        const data = eventos.map(toFrontend);
        return res.json({ eventos: data, total: data.length });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Filtros inválidos',
                errors: e.errors
            });
        }
        console.error('Error al obtener eventos:', e);
        return res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const obtenerEventoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un UUID válido
        const idValidation = z.string().uuid().safeParse(id);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de evento inválido' });
        }
        
        const evento = await prisma.evento.findFirst({ 
            where: { id, activo: true },
            include: { // --- CÓDIGO CORREGIDO --- (El tuyo estaba duplicado)
                _count: {
                    select: { 
                        inscripciones: { 
                            where: { estado: 'activa' } 
                        } 
                    }
                }
            }
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
    
        // Validar que el ID sea un UUID válido
        const idValidation = z.string().uuid().safeParse(id);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de evento inválido' });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        // Validar datos del formulario con Zod
        const validatedData = actualizarEventoSchema.parse(req.body);

        const updateData: any = {};
        
        if (validatedData.nombre !== undefined) updateData.nombre = validatedData.nombre;
        if (validatedData.descripcionLarga !== undefined) updateData.descripcionLarga = validatedData.descripcionLarga;
        if (validatedData.ciudad !== undefined) updateData.ciudad = validatedData.ciudad;
        if (validatedData.barrio !== undefined) updateData.barrio = validatedData.barrio;
        if (validatedData.tematica !== undefined) updateData.tematica = validatedData.tematica;
        if (validatedData.musica !== undefined) updateData.musica = validatedData.musica;
        if (validatedData.precio !== undefined) updateData.precio = validatedData.precio ? Number(validatedData.precio) : null;
        if (validatedData.precioVip !== undefined) updateData.precioVip = validatedData.precioVip ? Number(validatedData.precioVip) : null;
        if (validatedData.cupoGeneral !== undefined) updateData.cupoGeneral = validatedData.cupoGeneral;
        if (validatedData.cupoVip !== undefined) updateData.cupoVip = validatedData.cupoVip;

        // --- CAMBIO AQUÍ: Manejo de archivos con Supabase para ACTUALIZAR ---

        // 1. Subir NUEVA portada si se proporcionó una
        if (files?.portada?.[0]) {
            console.log('Subiendo nueva portada...');
            const portadaUrl = await uploadFileToSupabase(files.portada[0]);
            updateData.portada = portadaUrl; // Añadir al objeto de actualización
            console.log('Nueva portada subida:', portadaUrl);
        }
        
        // 2. Subir NUEVAS imágenes de galería si se proporcionaron
        if (files?.imagenes && files.imagenes.length > 0) {
            console.log(`Subiendo ${files.imagenes.length} nuevas imágenes de galería...`);
            const nuevasImagenesUrls = await Promise.all(
                files.imagenes.map(file => uploadFileToSupabase(file))
            );
            console.log('Nuevas imágenes de galería subidas:', nuevasImagenesUrls);
            
            // Esta lógica REEMPLAZA la galería existente, igual que tu código original.
            updateData.imagenes = nuevasImagenesUrls; 
        }
        // --- FIN DEL CAMBIO ---

        const evento = await prisma.evento.update({
            where: { id },
            data: updateData,
        });

        return res.json({ 
            message: 'Evento actualizado', 
            evento: toFrontend(evento) 
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: e.errors
            });
        }
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
        
        // Validar que el ID sea un UUID válido
        const idValidation = z.string().uuid().safeParse(id);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de evento inválido' });
        }
        
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
        
        // Validar que el ID sea un UUID válido
        const idValidation = z.string().uuid().safeParse(empresaId);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de empresa inválido' });
        }
        
        const eventos = await prisma.evento.findMany({
            where: { empresaId, activo: true },
            orderBy: { fecha: 'asc' },
            include: {
                _count: {
                    select: { 
                        inscripciones: { 
                            where: { estado: 'activa' } 
                        } 
                    }
                }
            }
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
        
        // Validar que el ID del evento sea un UUID válido
        const idValidation = z.string().uuid().safeParse(eventoId);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de evento inválido' });
        }

        // Validar datos de inscripción con Zod
        const validatedData = inscripcionSchema.parse(req.body);
        const { usuarioId, tipoEntrada } = validatedData;

        // 1. OBTENER EL EVENTO Y VERIFICAR QUE EXISTE
        const evento = await prisma.evento.findFirst({
            where: { id: eventoId, activo: true }
        });

        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado o inactivo' });
        }

        // 1.5. VALIDAR EDAD MÍNIMA
        if (evento.edadMinima) {
            const usuario = await prisma.usuario.findUnique({
                where: { id: usuarioId },
                select: { id: true, edad: true, nombre: true }
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Si el usuario no tiene edad registrada
            if (!usuario.edad) {
                return res.status(400).json({ 
                    message: `Este evento requiere edad mínima de ${evento.edadMinima} años. Por favor, actualiza tu edad en tu perfil para poder inscribirte.`,
                    edadMinimaRequerida: evento.edadMinima,
                    edadUsuario: null,
                    requiresAgeUpdate: true
                });
           }

            // Si el usuario es menor a la edad mínima
            if (usuario.edad < evento.edadMinima) {
                return res.status(400).json({ 
                    message: `No puedes inscribirte a este evento. Edad mínima requerida: ${evento.edadMinima} años. Tu edad: ${usuario.edad} años.`,
                    edadMinimaRequerida: evento.edadMinima,
                    edadUsuario: usuario.edad,
                    ageRestricted: true
                });
            }
        }

        // 2. VERIFICAR SI YA ESTÁ INSCRITO
        const inscripcionExistente = await prisma.inscripcion.findFirst({
            where: {
                usuarioId: usuarioId,
                eventoId: eventoId
            }
        });

        if (inscripcionExistente && inscripcionExistente.estado === 'activa') {
            return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
        }

        // 3. CONTAR INSCRIPCIONES ACTUALES POR TIPO
        const inscripcionesGenerales = await prisma.inscripcion.count({
            where: {
                eventoId: eventoId,
                tipoEntrada: 'general',
                estado: 'activa'
            }
        });

        const inscripcionesVip = await prisma.inscripcion.count({
            where: {
                eventoId: eventoId,
                tipoEntrada: 'vip',
                estado: 'activa'
            }
        });

        // 4. VALIDAR DISPONIBILIDAD SEGÚN TIPO DE ENTRADA
        if (tipoEntrada === 'general') {
            const cupoGeneral = evento.cupoGeneral || 0;
            if (inscripcionesGenerales >= cupoGeneral) {
                return res.status(400).json({ 
                    message: `No hay cupo disponible para entradas generales. Disponibles: ${cupoGeneral - inscripcionesGenerales}`,
                    disponibles: cupoGeneral - inscripcionesGenerales,
                    tipo: 'general'
                });
            }
        } else if (tipoEntrada === 'vip') {
            const cupoVip = evento.cupoVip || 0;
            if (inscripcionesVip >= cupoVip) {
                return res.status(400).json({ 
                    message: `No hay cupo disponible para entradas VIP. Disponibles: ${cupoVip - inscripcionesVip}`,
                    disponibles: cupoVip - inscripcionesVip,
                    tipo: 'vip'
                });
            }
        }

        // 5. CREAR O REACTIVAR INSCRIPCIÓN
        let inscripcion;

        if (inscripcionExistente && inscripcionExistente.estado === 'cancelada') {
            // Reactivar inscripción cancelada
            inscripcion = await prisma.inscripcion.update({
                where: { id: inscripcionExistente.id },
                data: { 
                     estado: 'activa', 
                    tipoEntrada,
                    fechaInscripcion: new Date()
                }
            });
            
            return res.status(200).json({ 
                message: 'Inscripción reactivada exitosamente', 
                inscripcion,
                disponiblesGeneral: (evento.cupoGeneral || 0) - (inscripcionesGenerales + (tipoEntrada === 'general' ? 1 : 0)),
                disponiblesVip: (evento.cupoVip || 0) - (inscripcionesVip + (tipoEntrada === 'vip' ? 1 : 0))
            });
        } else {
            // Crear nueva inscripción
            inscripcion = await prisma.inscripcion.create({
                data: { eventoId, usuarioId, tipoEntrada },
            });

            return res.status(201).json({ 
                message: 'Inscripción realizada exitosamente', 
                inscripcion,
                disponiblesGeneral: (evento.cupoGeneral || 0) - (inscripcionesGenerales + (tipoEntrada === 'general' ? 1 : 0)),
                disponiblesVip: (evento.cupoVip || 0) - (inscripcionesVip + (tipoEntrada === 'vip' ? 1 : 0))
           });
        }

    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos de inscripción inválidos',
                errors: e.errors
            });
        }
        console.error('Error al inscribirse:', e);
        return res.status(500).json({ message: 'Error al inscribirse' });
    }
};

export const desinscribirseEvento = async (req: Request, res: Response) => {
    try {
        const { eventoId, usuarioId } = req.params;

        // Validar que los IDs sean UUIDs válidos
        const eventoIdValidation = z.string().uuid().safeParse(eventoId);
        const usuarioIdValidation = z.string().uuid().safeParse(usuarioId);
        
        if (!eventoIdValidation.success || !usuarioIdValidation.success) {
            return res.status(400).json({ message: 'IDs inválidos' });
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

        // Validar que el ID sea un UUID válido
        const idValidation = z.string().uuid().safeParse(usuarioId);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }

        const inscs = await prisma.inscripcion.findMany({
            where: { 
                usuarioId, 
                estado: 'activa',
                evento: {
                    activo: true
                }
            },
            include: { evento: true },
        }) as InscripcionConEvento[];
        
        const data = inscs.map((i) => toFrontend(i.evento));

        return res.json({ eventos: data, total: data.length });
    } catch (e) {
        console.error('Error al obtener eventos inscritos:', e);
        return res.status(500).json({ message: 'Error al obtener eventos inscritos' });
    }
};

// Función auxiliar para obtener estadísticas de inscripciones
export const obtenerEstadisticasEvento = async (req: Request, res: Response) => {
    try {
        const { id: eventoId } = req.params;
        
        // Validar que el ID sea un UUID válido
        const idValidation = z.string().uuid().safeParse(eventoId);
        if (!idValidation.success) {
            return res.status(400).json({ message: 'ID de evento inválido' });
        }
        
        const evento = await prisma.evento.findFirst({
            where: { id: eventoId, activo: true }
      });

        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        const [inscripcionesGenerales, inscripcionesVip] = await Promise.all([
            prisma.inscripcion.count({
                where: { eventoId, tipoEntrada: 'general', estado: 'activa' }
            }),
            prisma.inscripcion.count({
                where: { eventoId, tipoEntrada: 'vip', estado: 'activa' }
            })
        ]);

        const cupoGeneral = evento.cupoGeneral || 0;
        const cupoVip = evento.cupoVip || 0;
        const disponiblesGeneral = cupoGeneral - inscripcionesGenerales;
        const disponiblesVip = cupoVip - inscripcionesVip;
        const totalInscripciones = inscripcionesGenerales + inscripcionesVip;
        const totalCupo = cupoGeneral + cupoVip;

        return res.json({
            evento: {
                id: evento.id,
                nombre: evento.nombre,
                fecha: evento.fecha
            },
            cupos: {
                cupoGeneral,
                cupoVip,
                total: totalCupo
            },
            inscripciones: {
                inscritosGeneral: inscripcionesGenerales,
                inscritosVip: inscripcionesVip,
                totalInscritos: totalInscripciones
            },
            disponibles: {
                disponiblesGeneral,
                disponiblesVip,
                totalDisponibles: totalCupo - totalInscripciones
            },
            porcentajes: {
                ocupacionGeneral: cupoGeneral > 0 ? ((inscripcionesGenerales / cupoGeneral) * 100).toFixed(1) : 0,
                ocupacionVip: cupoVip > 0 ? ((inscripcionesVip / cupoVip) * 100).toFixed(1) : 0,
                ocupacionTotal: totalCupo > 0 ? ((totalInscripciones / totalCupo) * 100).toFixed(1) : 0
            }
        });
    } catch (e) {
        console.error('Error al obtener estadísticas:', e);
        return res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};