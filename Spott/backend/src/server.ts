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
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = [
    'http://localhost:5173',
    'https://utn-ds-25-grupo-05.vercel.app',
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            // Permitir si está en la lista O si es un preview deployment de Vercel
            if (
                allowedOrigins.includes(origin) ||
                origin.match(/^https:\/\/utn-ds-?25-grupo-05.*\.vercel\.app$/)
            ) {
                callback(null, true);
            } else {
                console.warn(`❌ Origen bloqueado por CORS: ${origin}`);
                callback(new Error('No permitido por CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'sin origin'}`);
    next();
});

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
app.use('/uploads', express.static(path.join(process.cwd(), UPLOAD_DIR) => {
    // Configurar headers CORS permisivos para imágenes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Configurar cache para mejorar rendimiento
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    next();
}, express.static(UPLOAD_DIR, {
    setHeaders: (res: Response, filePath: string) => {
        // Configurar tipo de contenido según extensión
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        } else if (filePath.endsWith('.gif')) {
            res.setHeader('Content-Type', 'image/gif');
        } else if (filePath.endsWith('.webp')) {
            res.setHeader('Content-Type', 'image/webp');
        }
    }
}));


// Rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/canciones', rutasCanciones);
app.use('/api/votos', rutasVotos);
app.use('/api/spotify', rutasSpotify);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/geo', geoRouter);

// Ruta raíz
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