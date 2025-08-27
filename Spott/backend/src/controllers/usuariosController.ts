// controllers/usuariosController.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from '../types/index.js';

// Simulamos una base de datos en memoria
let usuarios: Usuario[] = [];

export const crearUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, fechaNacimiento, ciudad, generosMusicalesFavoritos } = req.body;

        // Verificar si el email ya existe
        const usuarioExistente = usuarios.find(u => u.email === email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const nuevoUsuario: Usuario = {
            id: uuidv4(),
            nombre,
            email,
            password, // En producción, hashear la contraseña
            fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
            ciudad,
            generosMusicalesFavoritos: generosMusicalesFavoritos || [],
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
            };

            usuarios.push(nuevoUsuario);

            // No devolver la contraseña
            const { password: _, ...usuarioSinPassword } = nuevoUsuario;

            res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: usuarioSinPassword
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

export const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const usuario = usuarios.find(u => u.email === email && u.password === password);
        if (!usuario) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // No devolver la contraseña
        const { password: _, ...usuarioSinPassword } = usuario;

        res.json({
        message: 'Login exitoso',
        usuario: usuarioSinPassword
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el login' });
    }
};

export const obtenerUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuario = usuarios.find(u => u.id === id);

        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { password: _, ...usuarioSinPassword } = usuario;
        res.json({ usuario: usuarioSinPassword });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioIndex = usuarios.findIndex(u => u.id === id);

        if (usuarioIndex === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuarios[usuarioIndex] = {
        ...usuarios[usuarioIndex],
        ...req.body,
        fechaActualizacion: new Date()
        };

        const { password: _, ...usuarioSinPassword } = usuarios[usuarioIndex];

        res.json({
        message: 'Usuario actualizado exitosamente',
        usuario: usuarioSinPassword
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};