import { z } from "zod";

export const cancionCreateSchema = z.object({
    titulo: z.string().trim().min(1, "El título es obligatorio"),
    artista: z.string().trim().min(1, "El artista es obligatorio"),
    eventoId: z.string().uuid("eventoId inválido"),
    genero: z.string().trim().min(1, "El género es obligatorio"),
});

export const cancionUpdateSchema = z.object({
    titulo: z.string().trim().min(1).optional(),
    artista: z.string().trim().min(1).optional(),
    genero: z.string().trim().min(1).optional(),
});

