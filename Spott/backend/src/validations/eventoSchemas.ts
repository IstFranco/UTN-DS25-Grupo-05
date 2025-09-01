import { z } from "zod";

export const crearEventoSchema = z.object({
    nombre: z.string().min(2),
    descripcionLarga: z.string().max(5000).optional().nullable(),
    ciudad: z.string().min(2),
    barrio: z.string().optional().nullable(),
    tematica: z.string().optional().nullable(),
    musica: z.string().min(2),
    fecha: z.coerce.date(),            // acepta string y lo convierte a Date
    precio: z.coerce.number().optional().nullable(),
    cupoGeneral: z.coerce.number().int().nonnegative().optional(),
    cupoVip: z.coerce.number().int().nonnegative().optional(),
    empresaId: z.string().uuid(),
});

export const actualizarEventoSchema = crearEventoSchema.partial();

export const filtrosEventoSchema = z.object({
    ciudad: z.string().optional(),
    musica: z.string().optional(),
    busqueda: z.string().optional(),
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
});

export const inscripcionSchema = z.object({
    usuarioId: z.string().uuid(),
    tipoEntrada: z.enum(["general", "vip"]).default("general"),
});
