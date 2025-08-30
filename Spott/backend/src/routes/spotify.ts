import { Router } from 'express';
import {
    getAvailableGenreSeeds,
    getRecommendationsByGenre,
    searchTracksByTitleAndGenre
} from '../spotify/spotifyService.js';

const router = Router();

router.get('/genres', async (_req, res) => {
    try {
        const genres = await getAvailableGenreSeeds();
        res.json({ genres });
    } catch (e: any) {
        res.status(500).json({ error: e.message ?? 'Error fetching genres' });
    }
});

router.get('/recommendations', async (req, res) => {
    try {
        const { genre = '', limit, market } = req.query as any;
        if (!genre) return res.status(400).json({ error: 'genre requerido' });
        const tracks = await getRecommendationsByGenre(genre, limit ? parseInt(String(limit),10) : 20, market as string | undefined);
        res.json({ tracks });
    } catch (e: any) {
        res.status(500).json({ error: e.message ?? 'Error getting recommendations' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { title = '', genre = '', limit, market } = req.query as any;
        if (!title || !genre) return res.status(400).json({ error: 'title y genre requeridos' });
        const tracks = await searchTracksByTitleAndGenre(title, genre, limit ? parseInt(String(limit),10) : 10, market as string | undefined);
        res.json({ tracks });
    } catch (e: any) {
        res.status(500).json({ error: e.message ?? 'Error searching tracks' });
    }
});

export default router;
