import { z } from "zod";

export const passwordSchema = z
    .string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres")
    .regex(/[A-Za-z]/, "Debe incluir al menos una letra")
    .regex(/\d/, "Debe incluir al menos un número");

export const empresaRegisterSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    email: z.string().trim().toLowerCase().email("Email inválido"),
    password: passwordSchema,
    descripcion: z.string().trim().optional(),
    telefono: z.string().trim().optional(),
    sitioWeb: z.string().trim().url("URL inválida").optional().or(z.literal("")),
});

export const empresaLoginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});