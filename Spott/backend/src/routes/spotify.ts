// src/routes/spotify.ts
import { Router } from 'express';
import {
    getAvailableGenreSeeds,
    getRecommendationsByGenre,
    searchTracksByTitleAndGenre
} from '../spotify/spotifyService.js';

const router = Router();

router.get('/genres', async (req, res) => {
    try {
        console.log('🎵 Obteniendo géneros de Spotify...');
        const genres = await getAvailableGenreSeeds();
        res.json({ genres });
    } catch (e: any) {
        console.error('❌ Error obteniendo géneros:', e);
        res.status(500).json({ error: e.message ?? 'Error fetching genres' });
    }
});

router.get('/recommendations', async (req, res) => {
    try {
        const { genre = '', limit, market } = req.query as any;
        if (!genre) return res.status(400).json({ error: 'genre requerido' });
        
        console.log(`🎵 Obteniendo recomendaciones para género: ${genre}`);
        const tracks = await getRecommendationsByGenre(
            genre,
            limit ? parseInt(String(limit), 10) : 20,
            market as string | undefined
        );
        res.json({ tracks });
    } catch (e: any) {
        console.error('❌ Error obteniendo recomendaciones:', e);
        res.status(500).json({ error: e.message ?? 'Error getting recommendations' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { title = '', genre = '', limit, market } = req.query as any;
        if (!title) return res.status(400).json({ error: 'titulo requerido' });
        
        console.log(`🔍 Buscando: "${title}" con género: "${genre || 'cualquiera'}"`);
        const tracks = await searchTracksByTitleAndGenre(
            title, 
            genre || '', 
            limit ? parseInt(String(limit), 10) : 10, 
            market as string | undefined
        );
        
        console.log(`✅ Encontradas ${tracks.length} canciones`);
        res.json({ tracks });
    } catch (e: any) {
        console.error('❌ Error buscando canciones:', e);
        res.status(500).json({ error: e.message ?? 'Error searching tracks' });
    }
});

export default router;