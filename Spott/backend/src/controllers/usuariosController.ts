// src/controllers/usuariosController.ts
import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';
import bcrypt from 'bcryptjs';



// Crear usuario
export const crearUsuario = async (req: Request, res: Response) => {
    try {
console.log('LLEGÓ REQUEST AL CONTROLLER');
        // Al inicio de crearUsuario
console.log('Usuarios existentes en BD:');
const todosUsuarios = await prisma.usuario.findMany();
console.log(todosUsuarios);
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
        }

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
        return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hash del password
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
        data: {
            nombre,
            email,
            password: hashedPassword,
        },
        });

        console.log('✅ Usuario creado en BD:', nuevoUsuario.id, nuevoUsuario.email);

        // No devolvemos el password
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
        const { nombre, email, password } = req.body;

        // Validar contraseña antes de procesarla
        if (password && password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Validar email
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

        const data: any = {
            nombre,
            email,
        };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

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
