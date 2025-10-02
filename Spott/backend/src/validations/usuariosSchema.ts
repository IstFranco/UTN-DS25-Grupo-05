// Spott/backend/src/validations/usuariosSchema.ts
import { z } from "zod";

const ALLOWED_EMAIL_RE = /@(gmail\.com|hotmail\.com|outlook\.com)$/i;

// Registro de usuario
export const usuarioRegisterSchema = z
    .object({
        nombre: z.string()
        .min(2, "Minimo 2 caracteres")
        .max(50, "Maximo 50 caracteres")
        .trim(),
        email: z
            .string()
            .email("Email inválido")
            .toLowerCase()
            .regex(
                ALLOWED_EMAIL_RE,
                "Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com"
            ),
        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .max(72, "La contraseña no puede superar 72 caracteres"),
        confirmPassword: z.string().optional(),
        ciudad: z.string().optional(),
        edad: z
            .union([z.string(), z.number()])
            .optional()
            .transform((val) => {
                if (val == null || val === '') return null;
                const num = Number(val);
                return !isNaN(num) && num > 0 && num <= 120 ? num : null;
            })
            .refine((val) => val === null || (val >= 1 && val <= 120), {
                message: "La edad debe estar entre 1 y 120 años",
            }),
    })
    .superRefine((data, ctx) => {
        if (
            data.confirmPassword !== undefined &&
            data.password !== data.confirmPassword
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Las contraseñas no coinciden",
            });
        }
    });

export const usuarioUpdateSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio").optional(),
    ciudad: z.string().optional(),
    edad: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
            if (val == null || val === '') return null;
            const num = Number(val);
            return !isNaN(num) && num > 0 && num <= 120 ? num : null;
        })
        .refine((val) => val === null || (val >= 1 && val <= 120), {
            message: "La edad debe estar entre 1 y 120 años",
        }),
});

// Login de usuario
export const usuarioLoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});