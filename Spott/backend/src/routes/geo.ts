import { Router } from "express";
import { listarProvincias, listarLocalidadesPorProvincia } from "../services/locationService.js";

const router = Router();

router.get("/provincias", async (_req, res) => {
    try {
    const provincias = await listarProvincias();
    res.json(provincias);
    } catch (e) {
    console.error(e);
    res.status(503).json({ message: "No se pudieron obtener las provincias" });
    }
});

router.get("/localidades", async (req, res) => {
    try {
    const provincia = String(req.query.provincia || "");
    const localidades = await listarLocalidadesPorProvincia(provincia);
    res.json(localidades);
    } catch (e) {
    console.error(e);
    res.status(503).json({ message: "No se pudieron obtener las localidades" });
    }
});

export default router;
