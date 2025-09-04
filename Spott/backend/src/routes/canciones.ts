import { Router } from 'express';
import {
    crearCancion, obtenerCanciones, obtenerCancionPorId,
    actualizarCancion, eliminarCancion, obtenerTallyCancion,
    crearCancionDesdeSpotify,
} from '../controllers/cancionesController.js';

const router = Router();

router.get('/', obtenerCanciones);                 
router.post('/', crearCancion);
router.post('/from-spotify', crearCancionDesdeSpotify);
router.get('/:id', obtenerCancionPorId);
router.put('/:id', actualizarCancion);
router.delete('/:id', eliminarCancion);
router.get('/:id/tally', obtenerTallyCancion);

export default router;
