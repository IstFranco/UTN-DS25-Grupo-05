const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getProvincias() {
    const r = await fetch(`${BASE}/geo/provincias`);
    if (!r.ok) throw new Error("Error al obtener provincias");
  return r.json(); // [{ nombre }]
}

export async function getLocalidades(provinciaNombre) {
    const u = new URL(`${BASE}/geo/localidades`);
    u.searchParams.set("provincia", provinciaNombre);
    const r = await fetch(u.toString());
    if (!r.ok) throw new Error("Error al obtener localidades");
  return r.json(); // [{ nombre }]
}
