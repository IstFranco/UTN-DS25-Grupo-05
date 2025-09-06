// src/controllers/usuariosController.ts
import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';
import { usuarioRegisterSchema } from '../validations/usuariosSchema.js';
import bcrypt from 'bcryptjs';

// Crear usuario
export const crearUsuario = async (req: Request, res: Response) => {
    console.log("LLEGÓ REQUEST AL CONTROLLER");
    try {
        // Validar los datos con Zod
        const validationResult = usuarioRegisterSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            return res.status(400).json({ 
                message: 'Datos inválidos',
                errors: validationResult.error.issues 
            });
        }

        let { nombre, email, password, edad, ciudad } = validationResult.data;

        // Convertir edad a número si viene como string
        if (edad !== undefined && typeof edad === 'string') {
            edad = parseInt(edad, 10);
        }

        console.log("Usuarios existentes en BD:");
        const usuariosExistentes = await prisma.usuario.findMany();
        console.log(usuariosExistentes);

        // Verificar si el usuario ya existe
        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hash del password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario (edad es opcional)
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password: hashedPassword,
                edad: edad ?? null,
                ciudad: ciudad || null,
            },
        });

        const { password: _, ...usuarioSinPassword } = nuevoUsuario;

        return res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: usuarioSinPassword,
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

// Login de usuario
export const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y password son requeridos' });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const { password: _, ...usuarioSinPassword } = usuario;
        return res.json({
            message: 'Login exitoso',
            usuario: usuarioSinPassword,
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error en el login' });
    }
};

// Obtener usuario
export const obtenerUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuario = await prisma.usuario.findUnique({ where: { id } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { password: _, ...usuarioSinPassword } = usuario;
        return res.json({ usuario: usuarioSinPassword });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Actualizar usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, edad, ciudad } = req.body;

        if (password && password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        if (edad !== undefined && (edad < 1 || edad > 120)) {
            return res.status(400).json({ message: 'La edad debe estar entre 1 y 120 años' });
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Formato de email inválido' });
            }

            const usuarioExistente = await prisma.usuario.findUnique({ 
                where: { email } 
            });
            if (usuarioExistente && usuarioExistente.id !== id) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
        }

        const data: any = {};
        if (nombre !== undefined) data.nombre = nombre;
        if (email !== undefined) data.email = email;
        if (edad !== undefined) data.edad = edad;
        if (ciudad !== undefined) data.ciudad = ciudad;
        if (password) data.password = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.update({
            where: { id },
            data,
        });

        const { password: _, ...usuarioSinPassword } = usuario;
        return res.json({
            message: 'Usuario actualizado exitosamente',
            usuario: usuarioSinPassword,
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};
