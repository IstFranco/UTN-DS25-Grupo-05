import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    crearEvento, 
    obtenerEventos, 
    obtenerEventoPorId, 
    actualizarEvento, 
    eliminarEvento,
    obtenerEventosPorEmpresa,
    inscribirseEvento,
    obtenerEventosInscritos,
    desinscribirseEvento
} from '../controllers/eventosController.js';

const router = express.Router();

// Configuración de multer (para uploads de portada e imágenes)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// -------------------- Rutas públicas --------------------
router.get('/', obtenerEventos);
router.get('/:id', obtenerEventoPorId);

// -------------------- Rutas de empresas --------------------
router.post('/', upload.fields([
    { name: 'portada', maxCount: 1 },
    { name: 'imagenes', maxCount: 10 }
]), crearEvento);

router.put('/:id', upload.fields([
    { name: 'portada', maxCount: 1 },
    { name: 'imagenes', maxCount: 10 }
]), actualizarEvento);

router.delete('/:id', eliminarEvento);
router.get('/empresa/:empresaId', obtenerEventosPorEmpresa);

// -------------------- Inscripciones de usuarios --------------------
router.post('/:id/inscribirse', inscribirseEvento);
router.delete('/:id/desinscribirse', desinscribirseEvento);
router.get('/usuario/:usuarioId/inscritos', obtenerEventosInscritos);

export default router;
