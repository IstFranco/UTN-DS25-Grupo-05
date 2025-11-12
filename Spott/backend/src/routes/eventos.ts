// src/routes/eventos.ts
import express from 'express';
import multer from 'multer';
// import path from 'path'; // Ya no lo necesitamos aquí
import {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento,
    eliminarEvento,
    obtenerEventosPorEmpresa,
    inscribirseEvento,
    obtenerEventosInscritos,
    desinscribirseEvento,
    obtenerEstadisticasEvento
} from '../controllers/eventosController.js';
import { validate } from '../middlewares/validate.js';
import { crearEventoSchema, actualizarEventoSchema, filtrosEventoSchema, inscripcionSchema } from '../validations/eventoSchemas.js';
import { prisma } from '../data/prisma.js';

const router = express.Router();

// --- CAMBIO AQUÍ ---
// Configuración de Multer para subir archivos A MEMORIA
const storage = multer.memoryStorage();

// // BORRAMOS O COMENTAMOS ESTO:
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

const upload = multer({
    storage, // <-- Ahora usa memoryStorage
    limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite por archivo
    files: 11 // máximo 11 archivos (1 portada + 10 imágenes)
    },
    fileFilter: (req, file, cb) => {
        // Validar que solo sean imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

// -------- Rutas GET - específicas primero, generales al final --------
router.get('/', validate(filtrosEventoSchema, 'query'), obtenerEventos);
router.get('/empresa/:empresaId', obtenerEventosPorEmpresa);
router.get('/usuario/:usuarioId/inscritos', obtenerEventosInscritos);

// Endpoint alternativo para verificar inscripción específica
router.get('/check/:eventoId/:usuarioId', async (req, res) => {
    try {
        const { eventoId, usuarioId } = req.params;
        console.log('🔍 Verificando inscripción:', { eventoId, usuarioId });
        const inscripcion = await prisma.inscripcion.findFirst({
            where: { eventoId, usuarioId, estado: 'activa' }
        });
        console.log('🔍 Inscripción encontrada:', !!inscripcion);
        res.json({ inscrito: !!inscripcion });
    } catch (error) {
        console.error('Error verificando inscripción:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// NUEVA RUTA: Estadísticas del evento
router.get('/:id/estadisticas', obtenerEstadisticasEvento);

//! /:id debe ir AL FINAL de todos los GET específicos
router.get('/:id', obtenerEventoPorId);

// -------- Rutas POST --------
router.post(
    '/',
    upload.fields([
        { name: 'portada', maxCount: 1 },
        { name: 'imagenes', maxCount: 10 }
    ]),
    validate(crearEventoSchema),
    crearEvento
);

router.post('/:id/inscribirse', validate(inscripcionSchema), inscribirseEvento);

// -------- Rutas PUT --------
router.put(
        '/:id',
        upload.fields([
            { name: 'portada', maxCount: 1 },
            { name: 'imagenes', maxCount: 10 }
    ]),
    validate(actualizarEventoSchema),
    actualizarEvento
);

// -------- Rutas DELETE --------
router.delete('/:id', eliminarEvento);
router.delete('/:eventoId/usuario/:usuarioId', desinscribirseEvento);

console.log('📋 Rutas de eventos configuradas correctamente');

export default router;