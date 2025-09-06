import { z } from "zod";

export const passwordSchema = z
    .string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres")
    .regex(/[A-Za-z]/, "Debe incluir al menos una letra")
    .regex(/\d/, "Debe incluir al menos un número");

export const usuarioRegisterSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email inválido")
      .regex(/@(gmail\.com|hotmail\.com|outlook\.com)$/, "Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com"),
    password: passwordSchema,
    edad: z.coerce.number().int().min(1, "La edad debe ser mayor a 0").max(120, "La edad no puede ser mayor a 120"),
    ciudad: z.string().trim().optional(),
});

export const usuarioLoginSchema = z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email inválido")
      .regex(/@(gmail\.com|hotmail\.com|outlook\.com)$/, "Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});