// src/routes/canciones.ts
import { Router } from 'express';
import {
    crearCancion,
    obtenerCanciones,
    obtenerCancionPorId,
    actualizarCancion,
    eliminarCancion,
    obtenerTallyCancion,
    crearCancionDesdeSpotify
    // NO incluimos recomendarCancionSpotify por ahora
} from '../controllers/cancionesController.js'; // ← NOTA: .js al final

const router = Router();

// Rutas específicas PRIMERO
router.get('/tally/:id', obtenerTallyCancion);
router.post('/spotify', crearCancionDesdeSpotify);

// Rutas generales
router.get('/', obtenerCanciones);
router.post('/', crearCancion);

// Rutas con parámetro dinámico AL FINAL
router.get('/:id', obtenerCancionPorId);
router.put('/:id', actualizarCancion);
router.delete('/:id', eliminarCancion);

export default router;