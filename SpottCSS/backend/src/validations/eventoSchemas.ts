import { z } from "zod";

export const crearEventoSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    descripcionLarga: z.string().max(5000).optional().nullable(),
    ciudad: z.string().min(2, "La ciudad es requerida"),
    barrio: z.string().optional().nullable(),
    tematica: z.string().optional().nullable(),
    musica: z.string().min(2, "El género musical es requerido"),
    fecha: z.coerce.date(),
    horaInicio: z.string().optional().nullable(),
    precio: z.coerce.number().min(0, "El precio no puede ser negativo").optional().nullable(),
    precioVip: z.coerce.number().min(0, "El precio VIP no puede ser negativo").optional().nullable(),
    cupoGeneral: z.coerce.number().int().min(0, "El cupo general no puede ser negativo").optional().default(0),
    cupoVip: z.coerce.number().int().min(0, "El cupo VIP no puede ser negativo").optional().default(0),
    edadMinima: z.coerce.number().int().min(0).max(100, "La edad mínima debe estar entre 0 y 100").optional().nullable(),
    estilo: z.string().optional().nullable(),
    accesible: z.coerce.boolean().default(false),
    linkExterno: z.string().url("Debe ser una URL válida").optional().nullable().or(z.literal("")),
    politicaCancelacion: z.string().max(500, "La política no puede exceder 500 caracteres").optional().nullable(),
    hashtag: z.string().max(50, "El hashtag no puede exceder 50 caracteres").optional().nullable(),
    empresaId: z.string().uuid("ID de empresa inválido"),
}).refine((data) => {
    // VALIDACIÓN: Debe haber al menos una entrada de tipo general (no tiene sentido que haya solo vips)
    const general = data.cupoGeneral || 0;
    const vip = data.cupoVip || 0;
    return general > 0;
}, {
    message: "Debe especificar al menos entrada general",
    path: ["cupoGeneral"]
}).refine((data) => {
    // VALIDACIÓN: La fecha no puede ser en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return data.fecha >= hoy;
}, {
    message: "La fecha del evento no puede ser en el pasado",
    path: ["fecha"]
}).refine((data) => {
    // VALIDACIÓN: Si hay cupo VIP, debe haber precio VIP
    const cupoVip = data.cupoVip || 0;
    const precioVip = data.precioVip;
    if (cupoVip > 0 && (!precioVip || precioVip <= 0)) {
        return false;
    }
    return true;
}, {
    message: "Si hay cupo VIP, debe especificar un precio VIP válido",
    path: ["precioVip"]
});

export const actualizarEventoSchema = z.object({
    nombre: z.string().min(2).optional(),
    descripcionLarga: z.string().max(5000).optional().nullable(),
    ciudad: z.string().min(2).optional(),
    barrio: z.string().optional().nullable(),
    tematica: z.string().optional().nullable(),
    musica: z.string().min(2).optional(),
    fecha: z.coerce.date().optional(),
    horaInicio: z.string().optional().nullable(),
    precio: z.coerce.number().min(0).optional().nullable(),
    precioVip: z.coerce.number().min(0).optional().nullable(),
    cupoGeneral: z.coerce.number().int().min(0).optional(),
    cupoVip: z.coerce.number().int().min(0).optional(),
    edadMinima: z.coerce.number().int().min(0).max(100).optional().nullable(),
    estilo: z.string().optional().nullable(),
    accesible: z.coerce.boolean().optional(),
    linkExterno: z.string().url().optional().nullable().or(z.literal("")),
    politicaCancelacion: z.string().max(500).optional().nullable(),
    hashtag: z.string().max(50).optional().nullable(),
}).refine((data) => {
    // Solo validar si algún cupo está presente
    if (data.cupoGeneral !== undefined) {
        return data.cupoGeneral > 0;
    }
    return true;
}, {
    message: "Debe especificar al menos entrada general",
    path: ["cupoGeneral"]
}).refine((data) => {
    // VALIDACIÓN: Si hay cupo VIP, debe haber precio VIP
    if (data.cupoVip !== undefined && data.cupoVip > 0) {
        return data.precioVip !== undefined && data.precioVip !== null && data.precioVip > 0;
    }
    return true;
}, {
    message: "Si hay cupo VIP, debe especificar un precio VIP válido",
    path: ["precioVip"]
});

export const filtrosEventoSchema = z.object({
    ciudad: z.string().optional(),
    musica: z.string().optional(),
    busqueda: z.string().optional(),
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
});

export const inscripcionSchema = z.object({
    usuarioId: z.string().uuid("ID de usuario inválido"),
    tipoEntrada: z.enum(["general", "vip"]).default("general"),
});