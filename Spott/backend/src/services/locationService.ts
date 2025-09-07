// backend/src/services/locationService.ts
import axios from "axios";

const GEOREF_BASE = "https://apis.datos.gob.ar/georef/api";

function normalize(s: string) {
    return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Verifica si una localidad pertenece a una provincia */
export async function localidadPerteneceAProvincia(localidad: string, provincia: string): Promise<boolean> {
    if (!localidad || !provincia) return false;

    const url = `${GEOREF_BASE}/localidades`;
    const params = { nombre: localidad, provincia, max: 5, campos: "nombre,provincia" };

    try {
    const { data } = await axios.get(url, { params, timeout: 5000 });
    const nProv = normalize(provincia);
    const nLoc = normalize(localidad);

    return (data?.localidades ?? []).some((loc: any) => {
        const lp = normalize(loc?.provincia?.nombre || "");
        const ln = normalize(loc?.nombre || "");
        return lp === nProv && ln === nLoc;
    });
    } catch {
    return false;
    }
}

/** Listar provincias (nombre) */
export async function listarProvincias(): Promise<Array<{ nombre: string }>> {
    const { data } = await axios.get(`${GEOREF_BASE}/provincias`, {
    params: { campos: "nombre", max: 50, orden: "nombre" },
    timeout: 5000,
    });
    return (data?.provincias ?? []).map((p: any) => ({ nombre: p.nombre }));
}

/** Listar localidades por nombre de provincia */
export async function listarLocalidadesPorProvincia(provincia: string): Promise<Array<{ nombre: string }>> {
    if (!provincia) return [];
    const { data } = await axios.get(`${GEOREF_BASE}/localidades`, {
    params: { provincia, campos: "nombre", max: 5000, orden: "nombre" },
    timeout: 7000,
    });
    return (data?.localidades ?? []).map((l: any) => ({ nombre: l.nombre }));
}
