// src/routes/favoritos.ts
import express from 'express';
import { agregarFavorito, eliminarFavorito, obtenerFavoritos, verificarFavorito } from '../controllers/favoritosController.js';

const router = express.Router();

router.post('/', agregarFavorito);
router.delete('/:eventoId/:usuarioId', eliminarFavorito);
router.get('/usuario/:usuarioId', obtenerFavoritos);
router.get('/check/:eventoId/:usuarioId', verificarFavorito);

export default router;