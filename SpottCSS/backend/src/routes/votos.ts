// src/routes/votos.ts
import { Router } from 'express';
import { crearVoto, obtenerVotos, eliminarVoto } from '../controllers/votosController.js';

const router = Router();

router.get('/', obtenerVotos);
router.post('/', crearVoto);
router.delete('/:id', eliminarVoto);

export default router;