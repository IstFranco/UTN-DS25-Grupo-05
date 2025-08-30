import { Router } from 'express';
import { crearVoto, obtenerVotos, eliminarVoto } from '../controllers/votosController.js';

const router = Router();

router.get('/', obtenerVotos);           // ?cancionId=
router.post('/', crearVoto);             // { cancionId, tipo: 'up'|'down', usuarioId? }
router.delete('/:id', eliminarVoto);

export default router;
