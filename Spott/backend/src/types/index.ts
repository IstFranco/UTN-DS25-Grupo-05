// types/index.ts
export interface Evento {
    id: string;
    nombre: string;
    descripcionCorta?: string;
    descripcionLarga?: string;
    edadMinima?: number;
    portada: string; // URL de la imagen
    imagenes: string[]; // Array de URLs
    fecha: string;
    horaInicio?: string;
    ciudad: string;
    barrio: string;
    estilo: string;
    tematica?: string;
    musica: string; // género musical
    precio?: number;
    cupo: number;
    entradasGenerales?: number;
    entradasVIP?: number;
    accesible: boolean;
    linkExterno?: string;
    politicaCancelacion?: string;
    hashtag?: string;
    empresaId: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    // Campos adicionales para la vista
    imageSrc: string; // para compatibilidad con el frontend
    title: string; // para compatibilidad con el frontend
    description: string; // para compatibilidad con el frontend
    rating: string; // para compatibilidad con el frontend
    inscripciones?: Inscripcion[];
    activo: boolean;
}

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    password: string;
    fechaNacimiento?: Date;
    ciudad?: string;
    generosMusicalesFavoritos: string[];
    fechaCreacion: Date;
    fechaActualizacion: Date;
}

export interface Empresa {
    id: string;
    nombre: string;
    email: string;
    password: string;
    descripcion?: string;
    telefono?: string;
    sitioWeb?: string;
    logo?: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}

export interface Inscripcion {
    id: string;
    usuarioId: string;
    eventoId: string;
    fechaInscripcion: Date;
    tipoEntrada: 'general' | 'vip';
    estado: 'activa' | 'cancelada';
}

export interface Cancion {
    id: string;
    eventoId: string;
    spotifyId?: string;
    nombre: string;
    artista: string;
    genero?: string;
    fechaRecomendacion: Date;
    votosUp: number;
    votosDown: number;
    activo: boolean;
}

export interface VotoCancion {
    id: string;
    cancionId: string;
    usuarioId?: string;
    tipo: 'up' | 'down';
    fechaVoto: Date;
}

// DTOs para requests
export interface CrearEventoDTO {
    nombre: string;
    descripcionLarga?: string;
    edadMinima?: number;
    fecha: string;
    horaInicio?: string;
    ciudad: string;
    barrio: string;
    estilo: string;
    tematica?: string;
    musica: string;
    precio?: number;
    cupo: number;
    entradasGenerales?: number;
    entradasVIP?: number;
    accesible: boolean;
    linkExterno?: string;
    politicaCancelacion?: string;
    hashtag?: string;
    empresaId: string;
}

export interface ActualizarEventoDTO extends Partial<CrearEventoDTO> {
    id: string;
}

export interface FiltrosEvento {
    ciudad?: string;
    barrio?: string;
    estilo?: string;
    musica?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    precioMax?: number;
    soloDisponibles?: boolean;
    busqueda?: string;
}