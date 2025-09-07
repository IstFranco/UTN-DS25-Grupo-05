// Spott/backend/src/routes/empresas.ts
import express from "express";
import {
    crearEmpresa,
    obtenerEmpresa,
    actualizarEmpresa,
    loginEmpresa,
} from "../controllers/empresasController.js";
import { validate } from "../middlewares/validate.js";
import {
    empresaRegisterSchema,
    empresaLoginSchema,
} from "../validations/empresaSchema.js";

const router = express.Router();

router.post("/registro", validate(empresaRegisterSchema), crearEmpresa);
router.post("/login", validate(empresaLoginSchema), loginEmpresa);

router.get("/:id", obtenerEmpresa);
router.put("/:id", actualizarEmpresa);

export default router;
