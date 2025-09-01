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

const router = express.Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// -------- Rutas con validación --------
router.get('/', validate(filtrosEventoSchema, 'query'), obtenerEventos);

// ¡más específica antes!
router.get('/empresa/:empresaId', obtenerEventosPorEmpresa);
router.get('/usuario/:usuarioId/inscritos', obtenerEventosInscritos);

router.get('/:id', obtenerEventoPorId);

router.post(
    '/',
    upload.fields([{ name: 'portada', maxCount: 1 }, { name: 'imagenes', maxCount: 10 }]),
    validate(crearEventoSchema),
    crearEvento
);

router.put(
    '/:id',
    upload.fields([{ name: 'portada', maxCount: 1 }, { name: 'imagenes', maxCount: 10 }]),
    validate(actualizarEventoSchema),
    actualizarEvento
);

router.delete('/:id', eliminarEvento);

router.post('/:id/inscribirse', validate(inscripcionSchema), inscribirseEvento);
router.delete('/:id/desinscribirse', desinscribirseEvento);

export default router;
