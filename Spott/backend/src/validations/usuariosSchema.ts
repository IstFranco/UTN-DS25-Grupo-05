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
    email: z.string().trim().toLowerCase().email("Email inválido"),
    password: passwordSchema,
    confirmPassword: z.string().trim(),

    ciudad: z.string().trim().optional(),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });
    }
});

export const usuarioLoginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});
