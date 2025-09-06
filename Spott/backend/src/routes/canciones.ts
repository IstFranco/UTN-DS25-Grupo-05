// Spott/backend/src/routes/canciones.ts
import { Router } from "express";
import {
    crearCancion,
    obtenerCanciones,
    obtenerCancionPorId,
    actualizarCancion,
    eliminarCancion,
    obtenerTallyCancion,
    crearCancionDesdeSpotify,
} from "../controllers/cancionesController.js";

import { validate } from "../middlewares/validate.js";
import {
    cancionCreateSchema,
    cancionUpdateSchema,
} from "../validations/cancionSchemas.js";

const router = Router();

router.get("/tally/:id", obtenerTallyCancion);
router.post("/spotify", crearCancionDesdeSpotify); // si querés, acá podrías validar un schema propio

router.get("/", obtenerCanciones);
router.post("/", validate(cancionCreateSchema), crearCancion);

router.get("/:id", obtenerCancionPorId);
router.put("/:id", validate(cancionUpdateSchema), actualizarCancion);
router.delete("/:id", eliminarCancion);

export default router;
