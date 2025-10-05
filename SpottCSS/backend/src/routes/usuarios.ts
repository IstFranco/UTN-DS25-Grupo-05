// Spott/backend/src/routes/usuarios.ts
import express from "express";
import {
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    loginUsuario,
} from "../controllers/usuariosController.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    usuarioRegisterSchema,
    usuarioLoginSchema,
} from "../validations/usuariosSchema.js";

const router = express.Router();

// Rutas publicas sin autenticacion requerida
router.post("/registro", validate(usuarioRegisterSchema), crearUsuario);
router.post("/login", validate(usuarioLoginSchema), loginUsuario);

// Rutas privadas con autenticacion requerida
router.get("/:id", authMiddleware, obtenerUsuario);
router.put("/:id", authMiddleware, actualizarUsuario);

export default router;
