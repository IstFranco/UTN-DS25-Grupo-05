import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import eventosRoutes from './routes/eventos.js';
import usuariosRoutes from './routes/usuarios.js';
import empresasRoutes from './routes/empresas.js';
import rutasCanciones from './routes/canciones.js';
import rutasVotos from './routes/votos.js';
import rutasSpotify from './routes/spotify.js';
import favoritosRoutes from './routes/favoritos.js';
import geoRouter from "./routes/geo.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS dinámico (localhost o frontend en producción)
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads'));

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Solo se permiten archivos de imagen'));
    }
});

// Rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/canciones', rutasCanciones);
app.use('/api/votos', rutasVotos);  
app.use('/api/spotify', rutasSpotify);
app.use('/api/favoritos', favoritosRoutes);
app.use("/api/geo", geoRouter);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

// Manejo de errores
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Backend corriendo en el puerto ${PORT}`);
});
