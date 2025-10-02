// src/controllers/empresasController.ts
import { Request, Response } from 'express';
import { prisma } from '../data/prisma.js';
import { 
    empresaRegisterSchema, 
    empresaLoginSchema, 
    empresaUpdateSchema
} from '../validations/empresaSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function sanitizeEmpresa(empresa: any) {
    if (!empresa) return empresa;
    const { password, ...rest } = empresa;
    return rest;
}

// Función helper para generar token
function generateToken(empresaId: string, userType: 'empresa') {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET no está configurado");
    }
    
    return jwt.sign(
        { userId: empresaId, userType },
        secret,
        { expiresIn: '7d' }
    );
}

// Crear empresa
export const crearEmpresa = async (req: Request, res: Response) => {
    try {
        const validatedData = empresaRegisterSchema.parse(req.body);
        const { nombre, email, password, descripcion, telefono, sitioWeb } = validatedData;

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
                descripcion: descripcion ?? null,
                telefono: telefono ?? null,
                sitioWeb: sitioWeb ?? null,
            },
        });

        // Generar token al registrarse
        const token = generateToken(nuevaEmpresa.id, 'empresa');

        return res.status(201).json({
            message: 'Empresa creada exitosamente',
            empresa: sanitizeEmpresa(nuevaEmpresa),
            token
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: e.errors
            });
        }
        console.error('Error al crear empresa:', e);
        return res.status(500).json({ message: 'Error al crear la empresa' });
    }
};

// Login empresa
export const loginEmpresa = async (req: Request, res: Response) => {
    try {
        const validatedData = empresaLoginSchema.parse(req.body);
        const { email, password } = validatedData;

        const empresa = await prisma.empresa.findUnique({ where: { email } });
        if (!empresa) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const esPasswordValido = await bcrypt.compare(password, empresa.password);
        if (!esPasswordValido) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token al hacer login
        const token = generateToken(empresa.id, 'empresa');

        return res.json({
            message: 'Login exitoso',
            empresa: sanitizeEmpresa(empresa),
            token
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: e.errors
            });
        }
        console.error('Error en login:', e);
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

        return res.json({ empresa: sanitizeEmpresa(empresa) });
    } catch (error) {
        console.error('Error al obtener empresa:', error);
        return res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};

// Actualizar empresa
export const actualizarEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const validatedData = empresaUpdateSchema.parse(req.body);
        const { nombre, email, password, descripcion, telefono, sitioWeb } = validatedData;

        if (email) {
            const empresaExistente = await prisma.empresa.findUnique({ 
                where: { email } 
            });
            if (empresaExistente && empresaExistente.id !== id) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
        }

        const data: any = {
            ...(nombre !== undefined ? { nombre } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(descripcion !== undefined ? { descripcion } : {}),
            ...(telefono !== undefined ? { telefono } : {}),
            ...(sitioWeb !== undefined ? { sitioWeb } : {}),
        };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const empresa = await prisma.empresa.update({
            where: { id },
            data,
        });

        return res.json({
            message: 'Empresa actualizada exitosamente',
            empresa: sanitizeEmpresa(empresa),
        });
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: e.errors
            });
        }
        if (e.code === 'P2025') {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        console.error('Error al actualizar empresa:', e);
        return res.status(500).json({ message: 'Error al actualizar la empresa' });
    }
};