// Spott/backend/src/validations/empresaSchema.ts
import { z } from "zod";

const ALLOWED_EMAIL_RE = /@(gmail\.com|hotmail\.com|outlook\.com)$/i;

// 👉 Exportamos passwordSchema para que el import del controller no rompa
export const passwordSchema = z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres");

export const empresaRegisterSchema = z
    .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    email: z
        .string()
        .email("Email inválido")
        .regex(
        ALLOWED_EMAIL_RE,
        "Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com"
        ),
    password: passwordSchema,                 // 👈 usamos el schema exportado
    confirmPassword: z.string().optional(),   // si viene, debe coincidir
    ciudad: z.string().optional(),
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

export const empresaLoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});
