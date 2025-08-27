// routes/usuarios.ts
import express from 'express';
import { crearUsuario, obtenerUsuario, actualizarUsuario, loginUsuario } from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/registro', crearUsuario);
router.post('/login', loginUsuario);
router.get('/:id', obtenerUsuario);
router.put('/:id', actualizarUsuario);

export default router;