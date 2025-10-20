import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import eventosRoutes from './routes/eventos.js';
import usuariosRoutes from './routes/usuarios.js';
import empresasRoutes from './routes/empresas.js';
import rutasCanciones from './routes/canciones.js';
import rutasVotos from './routes/votos.js';
import rutasSpotify from './routes/spotify.js';
import favoritosRoutes from './routes/favoritos.js';
import geoRouter from './routes/geo.js';

const app = express();

// Puerto: Render inyecta process.env.PORT; en local usamos 3000
const PORT = Number(process.env.PORT || 3000);

// CORS dinámico: primero CORS_ORIGIN (prod), luego FRONTEND_URL, sino localhost
const FRONTEND =
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173';

app.use(
    cors({
        origin: FRONTEND,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asegurar carpeta de uploads en prod
const UPLOAD_DIR = 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Solo se permiten archivos de imagen'));
    },
});

// Estáticos
app.use('/uploads', express.static(UPLOAD_DIR));

// Rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/canciones', rutasCanciones);
app.use('/api/votos', rutasVotos);
app.use('/api/spotify', rutasSpotify);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/geo', geoRouter);

// Añadir esta ruta a tu servidor antes de app.use('/api/votos', ...)
app.get('/', (_, res: Response) => {
    res.json({
        status: 'ok',
    message: 'API funcionando. Usa las rutas /api/... para interactuar.'
    });
});

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

// Manejo de errores
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor', error: msg });
});

// Listen: bind a 0.0.0.0 para Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend corriendo en el puerto ${PORT}`);
});

