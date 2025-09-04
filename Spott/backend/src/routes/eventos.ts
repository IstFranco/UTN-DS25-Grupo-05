// src/routes/eventos.ts
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
import { validate } from '../middlewares/validate.js';
import { crearEventoSchema, actualizarEventoSchema, filtrosEventoSchema, inscripcionSchema } from '../validations/eventoSchemas.js';

console.log('📋 Cargando rutas de eventos...');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// -------- Rutas GET - específicas primero, generales al final --------
router.get('/', obtenerEventos);
router.get('/empresa/:empresaId', obtenerEventosPorEmpresa);
router.get('/usuario/:usuarioId/inscritos', obtenerEventosInscritos);
// IMPORTANTE: /:id debe ir AL FINAL de todos los GET específicos
router.get('/:id', obtenerEventoPorId);

// -------- Rutas POST --------
router.post(
    '/',
    upload.fields([{ name: 'portada', maxCount: 1 }, { name: 'imagenes', maxCount: 10 }]),
    crearEvento
);
router.post('/:id/inscribirse', inscribirseEvento);

// -------- Rutas PUT --------
router.put(
    '/:id',
    upload.fields([{ name: 'portada', maxCount: 1 }, { name: 'imagenes', maxCount: 10 }]),
    validate(actualizarEventoSchema),
    actualizarEvento
);

// -------- Rutas DELETE --------
router.delete('/:id', eliminarEvento);
router.delete('/:id/desinscribirse', desinscribirseEvento);

console.log('📋 Rutas de eventos configuradas correctamente');
export default router;