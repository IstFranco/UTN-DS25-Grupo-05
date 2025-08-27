// controllers/empresasController.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Empresa } from '../types/index.js';

// Simulamos una base de datos en memoria
let empresas: Empresa[] = [];

export const crearEmpresa = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, descripcion, telefono, sitioWeb } = req.body;

        // Verificar si el email ya existe
        const empresaExistente = empresas.find(e => e.email === email);
        if (empresaExistente) {
        return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const nuevaEmpresa: Empresa = {
        id: uuidv4(),
        nombre,
        email,
        password, // En producción, hashear la contraseña
        descripcion,
        telefono,
        sitioWeb,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
        };

        empresas.push(nuevaEmpresa);

        // No devolver la contraseña
        const { password: _, ...empresaSinPassword } = nuevaEmpresa;

        res.status(201).json({
        message: 'Empresa creada exitosamente',
        empresa: empresaSinPassword
        });
    } catch (error) {
        console.error('Error al crear empresa:', error);
        res.status(500).json({ message: 'Error al crear la empresa' });
    }
};

export const loginEmpresa = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const empresa = empresas.find(e => e.email === email && e.password === password);
        if (!empresa) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // No devolver la contraseña
        const { password: _, ...empresaSinPassword } = empresa;

        res.json({
        message: 'Login exitoso',
        empresa: empresaSinPassword
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el login' });
    }
};

export const obtenerEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const empresa = empresas.find(e => e.id === id);

        if (!empresa) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        const { password: _, ...empresaSinPassword } = empresa;
        res.json({ empresa: empresaSinPassword });
    } catch (error) {
        console.error('Error al obtener empresa:', error);
        res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};

export const actualizarEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const empresaIndex = empresas.findIndex(e => e.id === id);

        if (empresaIndex === -1) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        empresas[empresaIndex] = {
        ...empresas[empresaIndex],
        ...req.body,
        fechaActualizacion: new Date()
        };

        const { password: _, ...empresaSinPassword } = empresas[empresaIndex];

        res.json({
        message: 'Empresa actualizada exitosamente',
        empresa: empresaSinPassword
        });
    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).json({ message: 'Error al actualizar la empresa' });
      }
};