// src/controllers/empresasController.ts
import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';
import bcrypt from 'bcryptjs';

// Crear empresa
export const crearEmpresa = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, descripcion, telefono, sitioWeb } = req.body;

        if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
        }

        const empresaExistente = await prisma.empresa.findUnique({ where: { email } });
        if (empresaExistente) {
        return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevaEmpresa = await prisma.empresa.create({
        data: {
            nombre,
            email,
            password: hashedPassword,
            descripcion,
            telefono,
            sitioWeb,
        },
        });

        const { password: _, ...empresaSinPassword } = nuevaEmpresa;

        return res.status(201).json({
        message: 'Empresa creada exitosamente',
        empresa: empresaSinPassword,
        });
    } catch (error) {
        console.error('Error al crear empresa:', error);
        return res.status(500).json({ message: 'Error al crear la empresa' });
    }
};

// Login empresa
export const loginEmpresa = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({ message: 'Email y password son requeridos' });
        }

        const empresa = await prisma.empresa.findUnique({ where: { email } });
        if (!empresa) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const esPasswordValido = await bcrypt.compare(password, empresa.password);
        if (!esPasswordValido) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const { password: _, ...empresaSinPassword } = empresa;
        return res.json({
        message: 'Login exitoso',
        empresa: empresaSinPassword,
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error en el login' });
    }
};

// Obtener empresa
export const obtenerEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const empresa = await prisma.empresa.findUnique({ where: { id } });

        if (!empresa) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        const { password: _, ...empresaSinPassword } = empresa;
        return res.json({ empresa: empresaSinPassword });
    } catch (error) {
        console.error('Error al obtener empresa:', error);
        return res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};

// Actualizar empresa
export const actualizarEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, descripcion, telefono, sitioWeb } = req.body;

        const data: any = {
        nombre,
        email,
        descripcion,
        telefono,
        sitioWeb,
        };

        if (password) {
        data.password = await bcrypt.hash(password, 10);
        }

        const empresa = await prisma.empresa.update({
        where: { id },
        data,
        });

        const { password: _, ...empresaSinPassword } = empresa;

        return res.json({
        message: 'Empresa actualizada exitosamente',
        empresa: empresaSinPassword,
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        console.error('Error al actualizar empresa:', error);
        return res.status(500).json({ message: 'Error al actualizar la empresa' });
    }
};
