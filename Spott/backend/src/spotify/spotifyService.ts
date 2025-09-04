import axios from "axios";
import dotenv from "dotenv";
import { getAppToken } from "./spotifyCore.js";

dotenv.config();

const DEFAULT_MARKET = process.env.DEFAULT_MARKET || "AR";

export async function getAvailableGenreSeeds(): Promise<string[]> {
    const token = await getAppToken();
    const { data } = await axios.get(
        "https://api.spotify.com/v1/recommendations/available-genre-seeds",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.genres ?? [];
}

export async function getRecommendationsByGenre(genre: string, limit = 20, market = DEFAULT_MARKET) {
    const token = await getAppToken();
    const { data } = await axios.get("https://api.spotify.com/v1/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
        params: { seed_genres: genre.toLowerCase(), limit, market }
    });
    return data.tracks ?? [];
}

export async function searchTracksByTitleAndGenre(
    title: string,
    genre: string,
    limit = 10,
    market = DEFAULT_MARKET
) {
    const token = await getAppToken();
    
    // Búsqueda inicial por título
    const search = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
            q: `track:"${title}"`,  // Búsqueda más precisa con comillas
            type: "track", 
            limit: Math.min(limit * 3, 50), // Buscar más para filtrar después
            market 
        }
    });

    const items = search.data?.tracks?.items ?? [];
    if (!items.length) return [];

    // Obtener géneros de todos los artistas
    const artistIds = Array.from(
        new Set(items.flatMap((t: any) => (t.artists ?? []).map((a: any) => a.id)).filter(Boolean))
    );

    const genresByArtist: Record<string, string[]> = {};
    for (let i = 0; i < artistIds.length; i += 50) {
        const chunk = artistIds.slice(i, i + 50);
        try {
            const { data } = await axios.get("https://api.spotify.com/v1/artists", {
                headers: { Authorization: `Bearer ${token}` },
                params: { ids: chunk.join(",") }
            });
            for (const a of data.artists) {
                genresByArtist[a.id] = a.genres ?? [];
            }
        } catch (error) {
            console.error('Error obteniendo géneros de artistas:', error);
        }
    }

    // Filtrar por género
    const wanted = genre.toLowerCase().trim();
    const filtered = items.filter((t: any) =>
        (t.artists ?? []).some((a: any) =>
            (genresByArtist[a.id] ?? []).some((g: string) => 
                g.toLowerCase().includes(wanted)
            )
        )
    );

    return filtered.slice(0, limit);
}

// Nueva función: búsqueda sin filtro de género
export async function searchTracksByTitle(
    title: string,
    limit = 10,
    market = DEFAULT_MARKET
) {
    const token = await getAppToken();
    
    const search = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
            q: title,  // Búsqueda más flexible sin track:
            type: "track", 
            limit,
            market 
        }
    });

    return search.data?.tracks?.items ?? [];
}

export async function getTrackById(spotifyId: string, market = DEFAULT_MARKET) {
    const token = await getAppToken();
    const { data } = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { market }
    });
    return data;
}