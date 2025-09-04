import React, { useEffect, useMemo, useState } from 'react';

const API = import.meta?.env?.VITE_API_URL || 'http://localhost:3001';

function getAnonUserId() {
    const key = 'anonUserId';
    let uid = localStorage.getItem(key);
    if (!uid) {
        uid = `u_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
        localStorage.setItem(key, uid);
    }
    return uid;
}

const PLACEHOLDER_IMG = "/placeholder.png";

// helper: quita tildes y pasa a minúsculas
const normalize = (s) => s?.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function SongVoting({ eventoId, usuarioInscrito = false, userId, generoEvento }) {
    // ---- hooks (siempre arriba) ----
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddSong, setShowAddSong] = useState(false);
    const [newSong, setNewSong] = useState({ title: '', artist: '' });
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);

    // Spotify search state
    const [spQuery, setSpQuery] = useState('');
    const [spLoading, setSpLoading] = useState(false);
    const [spError, setSpError] = useState(null);
    const [spResults, setSpResults] = useState([]); // raw tracks de Spotify

    const effectiveUserId = userId || getAnonUserId();

    // Cargar canciones del evento CON VOTOS
    useEffect(() => {
        if (!usuarioInscrito || !eventoId) return;
        let alive = true;
        (async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Incluir usuarioId para obtener los votos del usuario
            const res = await fetch(`${API}/api/canciones?eventoId=${encodeURIComponent(eventoId)}&usuarioId=${encodeURIComponent(effectiveUserId)}`);
            if (!res.ok) throw new Error('No se pudieron obtener las canciones');
            const data = await res.json();
            
            console.log('🎵 Datos recibidos del backend:', data);
            
            const mapped = (data.canciones || []).map(c => ({
            id: c.id,
            title: c.titulo,
            artist: c.artista,
            votesUp: c.votosUp ?? 0,        // Conteos calculados por el backend
            votesDown: c.votosDown ?? 0,    // Conteos calculados por el backend
            image: PLACEHOLDER_IMG,
            // Mapear el voto del usuario desde el backend
            userVote: c.votoUsuario ? 
                (c.votoUsuario.tipo === 'up' ? 'like' : 'dislike') : null,
            userVoteId: c.votoUsuario ? c.votoUsuario.id : null,
            }));
            
            console.log('🎵 Canciones mapeadas con votos:', mapped);
            if (alive) setSongs(mapped);
        } catch (e) {
            if (alive) setError(e.message || 'Error cargando canciones');
        } finally {
            if (alive) setLoading(false);
        }
        })();
        return () => { alive = false; };
    }, [usuarioInscrito, eventoId, effectiveUserId]); // Agregar effectiveUserId como dependencia

    // Búsqueda y orden
    const filteredSongs = useMemo(() => {
        const q = (searchTerm || '').toLowerCase();
        return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    }, [songs, searchTerm]);

    const sortedSongs = useMemo(() => {
        return [...filteredSongs].sort((a, b) => {
        const scoreA = (a.votesUp || 0) - (a.votesDown || 0);
        const scoreB = (b.votesUp || 0) - (b.votesDown || 0);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return (b.votesUp || 0) - (a.votesUp || 0);
        });
    }, [filteredSongs]);

    // Cortar render si no está inscrito (después de los hooks)
    if (!usuarioInscrito) return null;

    // ---- crear manual ----
    const handleAddSong = async () => {
        if (!newSong.title.trim() || !newSong.artist.trim()) return;
        try {
        setPosting(true);
        setError(null);
        const res = await fetch(`${API}/api/canciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                eventoId, 
                titulo: newSong.title.trim(),
                artista: newSong.artist.trim() 
            })
        });
        if (!res.ok) throw new Error('No se pudo crear la canción');
        const { cancion } = await res.json();
        setSongs(prev => [...prev, {
            id: cancion.id,
            title: cancion.titulo,
            artist: cancion.artista,
            votesUp: 0,
            votesDown: 0,
            image: PLACEHOLDER_IMG,
            userVote: null,
            userVoteId: null,
        }]);
        setNewSong({ title: '', artist: '' });
        setShowAddSong(false);
        } catch (e) {
        setError(e.message || 'Error al agregar canción');
        } finally {
        setPosting(false);
        }
    };

    // ---- Spotify: buscar y agregar ----
    const searchSpotify = async () => {
        if (!spQuery.trim()) return;
        try {
        setSpLoading(true);
        setSpError(null);
        const genreParam = generoEvento ? normalize(generoEvento) : '';
        const url = `${API}/api/spotify/search?title=${encodeURIComponent(spQuery)}&genre=${encodeURIComponent(genreParam)}&limit=8`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se pudo buscar en Spotify');
        const { tracks } = await res.json();
        setSpResults(tracks || []);
        } catch (e) {
        setSpError(e.message || 'Error buscando en Spotify');
        } finally {
        setSpLoading(false);
        }
    };

    const addFromSpotify = async (track) => {
        try {
        setPosting(true);
        setError(null);
        const res = await fetch(`${API}/api/canciones/spotify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            eventoId,
            spotifyId: track.id
            })
        });
        if (!res.ok) throw new Error('No se pudo crear desde Spotify');
        const { cancion } = await res.json();
        setSongs(prev => [...prev, {
            id: cancion.id,
            title: cancion.titulo,
            artist: cancion.artista,
            votesUp: 0,
            votesDown: 0,
            image: track?.album?.images?.[0]?.url || PLACEHOLDER_IMG,
            userVote: null,
            userVoteId: null,
        }]);
        setShowAddSong(false);
        setSpResults([]);
        setSpQuery('');
        } catch (e) {
        setError(e.message || 'Error al agregar desde Spotify');
        } finally {
        setPosting(false);
        }
    };

    // ---- votar / deshacer / cambiar ----
    const handleVote = async (songId, voteType) => {
        setSongs(prev => prev.map(s => (s.id === songId ? { ...s, _busy: true } : s)));
        try {
        const song = songs.find(s => s.id === songId);
        if (!song) return;
        const current = song.userVote;
        const currentVoteId = song.userVoteId;

        if (current === voteType && currentVoteId) {
            console.log('🗳️ Eliminando voto existente:', currentVoteId);
            const res = await fetch(`${API}/api/votos/${currentVoteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('No se pudo eliminar el voto');
            
            const data = await res.json();
            setSongs(prev => prev.map(s => {
            if (s.id !== songId) return s;
            return {
                ...s,
                votesUp: data?.cancion?.votosUp ?? (voteType === 'like' ? Math.max(0, (s.votesUp || 0) - 1) : s.votesUp),
                votesDown: data?.cancion?.votosDown ?? (voteType === 'dislike' ? Math.max(0, (s.votesDown || 0) - 1) : s.votesDown),
                userVote: null,
                userVoteId: null,
                _busy: false
            };
            }));
            return;
        }

        if (current && currentVoteId && current !== voteType) {
            console.log('🗳️ Cambiando voto de', current, 'a', voteType);
            const del = await fetch(`${API}/api/votos/${currentVoteId}`, { method: 'DELETE' });
            if (!del.ok) throw new Error('No se pudo cambiar el voto (fase 1)');
        }

        console.log('🗳️ Creando nuevo voto:', { cancionId: songId, tipo: voteType === 'like' ? 'up' : 'down' });

        const res = await fetch(`${API}/api/votos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            cancionId: songId,
            tipo: voteType === 'like' ? 'up' : 'down',
            usuarioId: effectiveUserId
            })
        });
        
        if (!res.ok) {
            throw new Error('No se pudo registrar el voto');
        }
        
        const data = await res.json();
        console.log('🗳️ Voto registrado, respuesta:', data);
        
        const newVoteId = data?.voto?.id;

        setSongs(prev => prev.map(s => {
            if (s.id !== songId) return s;
            const updated = data?.cancion;
            return {
            ...s,
            votesUp: updated?.votosUp ?? s.votesUp,
            votesDown: updated?.votosDown ?? s.votesDown,
            userVote: voteType,
            userVoteId: newVoteId || null,
            _busy: false
            };
        }));
        } catch (e) {
        console.log('❌ Error en handleVote:', e);
        setError(e.message || 'Error al votar');
        setSongs(prev => prev.map(s => (s.id === songId ? { ...s, _busy: false } : s)));
        }
    };

    // ---- UI ----
    return (
        <div className="song-voting-container">
        <div className="song-voting-header">
            <h2>Song Voting</h2>
            <button className="btn-add-song" onClick={() => setShowAddSong(true)} disabled={posting}>
            + Add Song
            </button>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {loading && <div className="loading">Cargando canciones…</div>}

        <div className="song-search-section">
            <input
            type="text"
            placeholder="Search playlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="song-search-input"
            />
            <span className="song-count">{filteredSongs.length} songs</span>
        </div>

        <div className="songs-list">
            {sortedSongs.map((song, index) => {
            const score = (song.votesUp || 0) - (song.votesDown || 0);
            return (
                <div key={song.id} className={`song-item ${song._busy ? 'busy' : ''}`}>
                <div className="song-rank">{index + 1}</div>

                <div className="song-info-container">
                    <img src={song.image} alt={song.title} className="song-image" />
                    <div className="song-details">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                    </div>
                </div>

                <div className="song-actions">
                    <div className="song-votes">{score}</div>
                    <button
                    className={`vote-btn like-btn ${song.userVote === 'like' ? 'active' : ''}`}
                    disabled={song._busy}
                    onClick={() => handleVote(song.id, 'like')}
                    >👍</button>
                    <button
                    className={`vote-btn dislike-btn ${song.userVote === 'dislike' ? 'active' : ''}`}
                    disabled={song._busy}
                    onClick={() => handleVote(song.id, 'dislike')}
                    >👎</button>
                </div>
                </div>
            );
            })}
        </div>

        {/* Modal Add Song */}
        {showAddSong && (
            <div className="add-song-modal">
            <div className="modal-content">
                <h3>Add New Song</h3>

                {/* Spotify Search */}
                <div className="spotify-search">
                <div className="row">
                    <input
                    type="text"
                    placeholder={`Search on Spotify by title ${generoEvento ? `(genre: ${generoEvento})` : ''}`}
                    value={spQuery}
                    onChange={(e) => setSpQuery(e.target.value)}
                    className="add-song-input"
                    />
                    <button className="btn-confirm" onClick={searchSpotify} disabled={spLoading || !spQuery.trim()}>
                    {spLoading ? 'Searching…' : 'Search Spotify'}
                    </button>
                </div>

                {spError && <div className="error-banner">{spError}</div>}
                {spLoading && <div className="loading">Buscando…</div>}
                {!spLoading && spQuery && spResults.length === 0 && (
                    <div className="muted">Sin resultados para "{spQuery}".</div>
                )}

                {!!spResults.length && (
                    <div className="spotify-results">
                    {spResults.map((t) => (
                        <div key={t.id} className="spotify-item">
                        <img
                            src={t?.album?.images?.[2]?.url || t?.album?.images?.[0]?.url || PLACEHOLDER_IMG}
                            alt={t.name}
                            className="spotify-thumb"
                        />
                        <div className="spotify-meta">
                            <div className="title">{t.name}</div>
                            <div className="artist">{(t.artists || []).map(a => a.name).join(' & ')}</div>
                        </div>
                        <button className="btn-confirm" onClick={() => addFromSpotify(t)} disabled={posting}>
                            Add
                        </button>
                        </div>
                    ))}
                    </div>
                )}
                </div>

                <hr />

                <div className="modal-actions">
                <button
                    className="btn-cancel"
                    onClick={() => {
                    setShowAddSong(false);
                    setNewSong({ title: '', artist: '' });
                    setSpResults([]);
                    setSpQuery('');
                    }}
                >Cancel</button>
                <button className="btn-confirm" disabled={posting} onClick={handleAddSong}>
                    {posting ? 'Adding…' : 'Add Song'}
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}