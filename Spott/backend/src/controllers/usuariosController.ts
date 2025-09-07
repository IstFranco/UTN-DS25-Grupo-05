// Spott/backend/src/controllers/usuariosController.ts
import type { Request, Response } from "express";
import { prisma } from "../data/prisma.js";
import bcrypt from "bcryptjs";
import { usuarioRegisterSchema, usuarioLoginSchema } from "../validations/usuariosSchema.js";

function sanitizeUsuario(u: any) {
    if (!u) return u;
    const { password, ...rest } = u;
    return rest;
}

export async function crearUsuario(req: Request, res: Response) {
    try {
        const validatedData = usuarioRegisterSchema.parse(req.body);
        const { nombre, email, password, ciudad, edad } = validatedData;

        //email único
        const exists = await prisma.usuario.findUnique({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const hashed = await bcrypt.hash(password, 10);

        console.log('Tipo de edad:', typeof edad, 'Valor:', edad);
        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password: hashed,
                ciudad: ciudad ?? null,
                edad,
            },
        });

        return res.status(201).json({
            message: "Usuario registrado correctamente",
            usuario: sanitizeUsuario(usuario),
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({ 
                message: "Datos inválidos", 
                errors: e.errors 
            });
        }
        console.error("crearUsuario", e);
        return res.status(500).json({ message: "Error al crear usuario" });
    }
}

export async function loginUsuario(req: Request, res: Response) {
    try {
        const validatedData = usuarioLoginSchema.parse(req.body);
        const { email, password } = validatedData;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const ok = await bcrypt.compare(password, usuario.password);
        if (!ok) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        return res.json({
            message: "Login exitoso",
            usuario: sanitizeUsuario(usuario),
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({ 
                message: "Datos inválidos", 
                errors: e.errors 
            });
        }
        console.error("loginUsuario", e);
        return res.status(500).json({ message: "Error al iniciar sesión" });
    }
}

export async function obtenerUsuario(req: Request, res: Response) {
    try {
        const u = await prisma.usuario.findUnique({ where: { id: req.params.id } });
        if (!u) return res.status(404).json({ message: "Usuario no encontrado" });
        return res.json({ usuario: sanitizeUsuario(u) });
    } catch (e) {
        console.error("obtenerUsuario", e);
        return res.status(500).json({ message: "Error al obtener usuario" });
    }
}

export async function actualizarUsuario(req: Request, res: Response) {
    try {
        const { nombre, ciudad, edad } = req.body;
        const u = await prisma.usuario.update({
            where: { id: req.params.id },
            data: {
                ...(nombre !== undefined ? { nombre } : {}),
                ...(ciudad !== undefined ? { ciudad } : {}),
                ...(edad !== undefined ? { edad } : {}),
            },
        });
        return res.json({ message: "Usuario actualizado", usuario: sanitizeUsuario(u) });
    } catch (e: any) {
        if (e?.code === "P2025") {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("actualizarUsuario", e);
        return res.status(500).json({ message: "Error al actualizar usuario" });
    }
}