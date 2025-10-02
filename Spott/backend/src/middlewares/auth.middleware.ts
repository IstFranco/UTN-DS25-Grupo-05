// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extender el tipo Request para incluir userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userType?: 'usuario' | 'empresa';
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(' ')[1];

        // Verificar el token
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET no está configurado");
        }

        const decoded = jwt.verify(token, secret) as {
            userId: string;
            userType: 'usuario' | 'empresa';
        };

        // Agregar la información del usuario al request
        req.userId = decoded.userId;
        req.userType = decoded.userType;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Token inválido" });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expirado" });
        }
        return res.status(500).json({ message: "Error al verificar token" });
    }
};

// Middleware opcional: permite acceso sin token pero lo valida si existe
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Continúa sin autenticación
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        
        if (!secret) {
            throw new Error("JWT_SECRET no está configurado");
        }

        const decoded = jwt.verify(token, secret) as {
            userId: string;
            userType: 'usuario' | 'empresa';
        };

        req.userId = decoded.userId;
        req.userType = decoded.userType;

        next();
    } catch (error) {
        // Si hay error, simplemente continúa sin autenticación
        next();
    }
};