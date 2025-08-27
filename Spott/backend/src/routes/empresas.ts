// routes/empresas.ts
import express from 'express';
import { crearEmpresa, obtenerEmpresa, actualizarEmpresa, loginEmpresa } from '../controllers/empresasController.js';

const router = express.Router();

router.post('/registro', crearEmpresa);
router.post('/login', loginEmpresa);
router.get('/:id', obtenerEmpresa);
router.put('/:id', actualizarEmpresa);

export default router;