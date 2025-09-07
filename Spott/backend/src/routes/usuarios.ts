// Spott/backend/src/routes/usuarios.ts
import express from "express";
import {
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    loginUsuario,
} from "../controllers/usuariosController.js";
import { validate } from "../middlewares/validate.js";
import {
    usuarioRegisterSchema,
    usuarioLoginSchema,
} from "../validations/usuariosSchema.js";

const router = express.Router();

// Validación antes de llegar al controller
router.post("/registro", validate(usuarioRegisterSchema), crearUsuario);
router.post("/login", validate(usuarioLoginSchema), loginUsuario);

router.get("/:id", obtenerUsuario);
router.put("/:id", actualizarUsuario);

export default router;
