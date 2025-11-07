// Spott/backend/src/routes/empresas.ts
import express from "express";
import {
    crearEmpresa,
    obtenerEmpresa,
    actualizarEmpresa,
    loginEmpresa,
} from "../controllers/empresasController.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    empresaRegisterSchema,
    empresaLoginSchema,
} from "../validations/empresaSchema.js";

const router = express.Router();

// RUTAS PÚBLICAS sin autenticacion
router.post("/registro", validate(empresaRegisterSchema), crearEmpresa);
router.post("/login", validate(empresaLoginSchema), loginEmpresa);
router.get("/:id", obtenerEmpresa);

// RUTAS PRIVADAS requiren autenticacion
router.put("/:id", authMiddleware, actualizarEmpresa);

export default router;