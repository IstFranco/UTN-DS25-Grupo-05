import { v4 as uuidv4 } from 'uuid';

/** Tipos */
export type VotoTipo = 'up' | 'down';

export interface Cancion {
    id: string;
    eventoId: string;
    nombre: string;
    artista: string;
    genero?: string;
    spotifyId?: string;
    votosUp: number;
    votosDown: number;
    creadoEn: Date;
    actualizadoEn: Date;
    activo: boolean;
}

export interface Voto {
    id: string;
    cancionId: string;
    usuarioId?: string | null;
    tipo: VotoTipo;
    creadoEn: Date;
}

/** “BD” en memoria */
const canciones: Cancion[] = [];
const votos: Voto[] = [];

/** Helpers */
const score = (c: Cancion) => c.votosUp - c.votosDown;

function incVote(c: Cancion, tipo: VotoTipo) {
    if (tipo === 'up') c.votosUp += 1;
    else c.votosDown += 1;
    c.actualizadoEn = new Date();
}
    function decVote(c: Cancion, tipo: VotoTipo) {
    if (tipo === 'up') c.votosUp = Math.max(0, c.votosUp - 1);
    else c.votosDown = Math.max(0, c.votosDown - 1);
    c.actualizadoEn = new Date();
}

/** API simple del store (para controladores) */
export const MusicStore = {
    // Canciones
    listCanciones: (f?: { eventoId?: string; genero?: string; q?: string }) => {
        let r = canciones.filter(c => c.activo);
        if (f?.eventoId) r = r.filter(c => c.eventoId === f.eventoId);
        if (f?.genero) r = r.filter(c => (c.genero ?? '').toLowerCase().includes(f.genero!.toLowerCase()));
        if (f?.q) {
        const s = f.q.toLowerCase();
        r = r.filter(c => c.nombre.toLowerCase().includes(s) || c.artista.toLowerCase().includes(s));
        }
        return r.sort((a,b) => score(b) - score(a) || b.votosUp - a.votosUp);
    },
    getCancion: (id: string) => canciones.find(c => c.id === id && c.activo) || null,
    createCancion: (data: {
        eventoId: string; nombre: string; artista: string; genero?: string; spotifyId?: string;
    }) => {
        const now = new Date();
        const c: Cancion = {
        id: uuidv4(),
        eventoId: data.eventoId,
        nombre: data.nombre,
        artista: data.artista,
        genero: data.genero,
        spotifyId: data.spotifyId,
        votosUp: 0,
        votosDown: 0,
        creadoEn: now,
        actualizadoEn: now,
        activo: true
        };
        canciones.push(c);
        return c;
    },
    updateCancion: (id: string, patch: { nombre?: string; artista?: string; genero?: string | null }) => {
        const i = canciones.findIndex(c => c.id === id && c.activo);
        if (i === -1) return null;
        const curr = canciones[i];
        const upd: Cancion = {
        ...curr,
        nombre: patch.nombre ?? curr.nombre,
        artista: patch.artista ?? curr.artista,
        genero: patch.genero === null ? undefined : (patch.genero ?? curr.genero),
        actualizadoEn: new Date()
        };
        canciones[i] = upd;
        return upd;
    },
    softDeleteCancion: (id: string) => {
        const i = canciones.findIndex(c => c.id === id && c.activo);
        if (i === -1) return false;
        canciones[i].activo = false;
        canciones[i].actualizadoEn = new Date();
        return true;
    },

    // Votos
    listVotos: (f?: { cancionId?: string }) => {
        let r = [...votos];
        if (f?.cancionId) r = r.filter(v => v.cancionId === f.cancionId);
        return r;
    },
    createVoto: (data: { cancionId: string; tipo: VotoTipo; usuarioId?: string | null }) => {
        const c = canciones.find(x => x.id === data.cancionId && x.activo);
        if (!c) return { error: 'Canción no encontrada' as const };
        const v: Voto = { id: uuidv4(), cancionId: c.id, tipo: data.tipo, usuarioId: data.usuarioId ?? null, creadoEn: new Date() };
        votos.push(v);
        incVote(c, data.tipo);
        return { voto: v, cancion: c };
    },
    deleteVoto: (id: string) => {
        const idx = votos.findIndex(v => v.id === id);
        if (idx === -1) return false;
        const v = votos[idx];
        votos.splice(idx, 1);
        const c = canciones.find(x => x.id === v.cancionId);
        if (c) decVote(c, v.tipo);
        return true;
    }
};
