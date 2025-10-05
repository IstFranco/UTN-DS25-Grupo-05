// src/controllers/spotifyController.ts
import { Request, Response } from 'express';
import { 
    searchTracksByTitleAndGenre, 
    getRecommendationsByGenre, 
    getAvailableGenreSeeds 
} from '../spotify/spotifyService.js';

export const searchTracks = async (req: Request, res: Response) => {
    try {
        const { title, genre, limit = 10 } = req.query as any;

        if (!title) {
            return res.status(400).json({ message: 'El parámetro title es requerido' });
        }

        console.log(`🔍 Buscando en Spotify: "${title}" con género: "${genre || 'cualquiera'}"`);

        let tracks = [];

        if (genre && genre.trim()) {
            // Buscar con filtro de género
            tracks = await searchTracksByTitleAndGenre(
                String(title), 
                String(genre), 
                parseInt(limit) || 10
            );
            console.log(`🎵 Encontradas ${tracks.length} canciones con género "${genre}"`);
        } else {
            // Buscar sin filtro de género (búsqueda general)
            const { searchTracksByTitle } = await import('../spotify/spotifyService.js');
            tracks = await searchTracksByTitle(String(title), parseInt(limit) || 10);
            console.log(`🎵 Encontradas ${tracks.length} canciones sin filtro de género`);
        }

        res.json({
            tracks,
            total: tracks.length,
            query: {
                title,
                genre: genre || null,
                limit: parseInt(limit) || 10
            }
        });

    } catch (error: any) {
        console.error('❌ Error en búsqueda de Spotify:', error);
        res.status(500).json({ 
            message: 'Error al buscar en Spotify',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getGenreSeeds = async (req: Request, res: Response) => {
    try {
        const genres = await getAvailableGenreSeeds();
        res.json({ genres });
    } catch (error: any) {
        console.error('❌ Error obteniendo géneros:', error);
        res.status(500).json({ 
            message: 'Error al obtener géneros de Spotify',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { genre, limit = 20 } = req.query as any;

        if (!genre) {
            return res.status(400).json({ message: 'El parámetro genre es requerido' });
        }

        const tracks = await getRecommendationsByGenre(
            String(genre), 
            parseInt(limit) || 20
        );

        res.json({
            tracks,
            total: tracks.length,
            genre
        });

    } catch (error: any) {
        console.error('❌ Error obteniendo recomendaciones:', error);
        res.status(500).json({ 
            message: 'Error al obtener recomendaciones',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};