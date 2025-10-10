import React, { useEffect, useMemo, useState } from 'react';

const API = import.meta?.env?.VITE_API_URL || 'http://localhost:3000';

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

const normalize = (s) => s?.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function SongVoting({ eventoId, usuarioInscrito = false, userId, generoEvento }) {
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddSong, setShowAddSong] = useState(false);
    const [newSong, setNewSong] = useState({ title: '', artist: '' });
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);

    const [spQuery, setSpQuery] = useState('');
    const [spLoading, setSpLoading] = useState(false);
    const [spError, setSpError] = useState(null);
    const [spResults, setSpResults] = useState([]);

    const effectiveUserId = userId || getAnonUserId();

    useEffect(() => {
        if (!usuarioInscrito || !eventoId) return;
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                
                const res = await fetch(`${API}/api/canciones?eventoId=${encodeURIComponent(eventoId)}&usuarioId=${encodeURIComponent(effectiveUserId)}`);
                if (!res.ok) throw new Error('No se pudieron obtener las canciones');
                const data = await res.json();
                
                const mapped = (data.canciones || []).map(c => ({
                    id: c.id,
                    title: c.titulo,
                    artist: c.artista,
                    votesUp: c.votosUp ?? 0,
                    votesDown: c.votosDown ?? 0,
                    image: PLACEHOLDER_IMG,
                    userVote: c.votoUsuario ? 
                        (c.votoUsuario.tipo === 'up' ? 'like' : 'dislike') : null,
                    userVoteId: c.votoUsuario ? c.votoUsuario.id : null,
                }));
                
                if (alive) setSongs(mapped);
            } catch (e) {
                if (alive) setError(e.message || 'Error cargando canciones');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [usuarioInscrito, eventoId, effectiveUserId]);

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

    if (!usuarioInscrito) return null;

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

    const handleVote = async (songId, voteType) => {
        setSongs(prev => prev.map(s => (s.id === songId ? { ...s, _busy: true } : s)));
        try {
            const song = songs.find(s => s.id === songId);
            if (!song) return;
            const current = song.userVote;
            const currentVoteId = song.userVoteId;

            if (current === voteType && currentVoteId) {
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
                const del = await fetch(`${API}/api/votos/${currentVoteId}`, { method: 'DELETE' });
                if (!del.ok) throw new Error('No se pudo cambiar el voto');
            }

            const res = await fetch(`${API}/api/votos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cancionId: songId,
                    tipo: voteType === 'like' ? 'up' : 'down',
                    usuarioId: effectiveUserId
                })
            });
            
            if (!res.ok) throw new Error('No se pudo registrar el voto');
            
            const data = await res.json();
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
            setError(e.message || 'Error al votar');
            setSongs(prev => prev.map(s => (s.id === songId ? { ...s, _busy: false } : s)));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 mt-6">
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">🎵 Votación de Canciones</h2>
                    <button 
                        onClick={() => setShowAddSong(true)} 
                        disabled={posting}
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                        + Agregar Canción
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-8">
                        <p className="text-slate-300">Cargando canciones…</p>
                    </div>
                )}

                {/* Búsqueda */}
                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Buscar en playlist..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                    />
                    <span className="ml-4 text-slate-400 text-sm">{filteredSongs.length} canciones</span>
                </div>

                {/* Lista de canciones */}
                <div className="space-y-3">
                    {sortedSongs.map((song, index) => {
                        const score = (song.votesUp || 0) - (song.votesDown || 0);
                        return (
                            <div 
                                key={song.id} 
                                className={`flex items-center gap-4 bg-slate-900/50 border border-purple-700/30 rounded-lg p-4 transition ${song._busy ? 'opacity-50' : ''}`}
                            >
                                <div className="text-slate-400 font-bold w-8 text-center">
                                    #{index + 1}
                                </div>

                                <img 
                                    src={song.image} 
                                    alt={song.title} 
                                    className="w-12 h-12 rounded object-cover"
                                />

                                <div className="flex-1">
                                    <div className="text-white font-semibold">{song.title}</div>
                                    <div className="text-slate-400 text-sm">{song.artist}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-white font-bold text-lg w-12 text-center">
                                        {score}
                                    </div>
                                    <button
                                        className={`px-3 py-2 rounded-lg transition ${
                                            song.userVote === 'like' 
                                                ? 'bg-green-600 hover:bg-green-700' 
                                                : 'bg-slate-800 hover:bg-slate-700'
                                        }`}
                                        disabled={song._busy}
                                        onClick={() => handleVote(song.id, 'like')}
                                    >
                                        👍
                                    </button>
                                    <button
                                        className={`px-3 py-2 rounded-lg transition ${
                                            song.userVote === 'dislike' 
                                                ? 'bg-red-600 hover:bg-red-700' 
                                                : 'bg-slate-800 hover:bg-slate-700'
                                        }`}
                                        disabled={song._busy}
                                        onClick={() => handleVote(song.id, 'dislike')}
                                    >
                                        👎
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Agregar Canción */}
            {showAddSong && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-purple-900/40 backdrop-blur-md border border-purple-700/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">Agregar Nueva Canción</h3>

                        {/* Búsqueda Spotify */}
                        <div className="mb-6">
                            <div className="flex gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder={`Buscar en Spotify${generoEvento ? ` (género: ${generoEvento})` : ''}`}
                                    value={spQuery}
                                    onChange={(e) => setSpQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <button 
                                    onClick={searchSpotify} 
                                    disabled={spLoading || !spQuery.trim()}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                                >
                                    {spLoading ? 'Buscando…' : 'Buscar'}
                                </button>
                            </div>

                            {spError && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-3">
                                    {spError}
                                </div>
                            )}

                            {!spLoading && spQuery && spResults.length === 0 && (
                                <p className="text-slate-400 text-sm">Sin resultados para "{spQuery}"</p>
                            )}

                            {!!spResults.length && (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {spResults.map((t) => (
                                        <div key={t.id} className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3">
                                            <img
                                                src={t?.album?.images?.[2]?.url || t?.album?.images?.[0]?.url || PLACEHOLDER_IMG}
                                                alt={t.name}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="text-white font-semibold">{t.name}</div>
                                                <div className="text-slate-400 text-sm">
                                                    {(t.artists || []).map(a => a.name).join(' & ')}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => addFromSpotify(t)} 
                                                disabled={posting}
                                                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-purple-700/30 pt-4 mb-4"></div>

                        {/* Agregar manual */}
                        <div className="space-y-3 mb-6">
                            <input
                                type="text"
                                placeholder="Título de la canción"
                                value={newSong.title}
                                onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                            <input
                                type="text"
                                placeholder="Artista"
                                value={newSong.artist}
                                onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowAddSong(false);
                                    setNewSong({ title: '', artist: '' });
                                    setSpResults([]);
                                    setSpQuery('');
                                }}
                                className="flex-1 px-4 py-3 bg-slate-900/50 border border-purple-700/50 text-white font-semibold rounded-lg hover:bg-slate-800/50 transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleAddSong}
                                disabled={posting || !newSong.title.trim() || !newSong.artist.trim()}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-semibold rounded-lg transition disabled:opacity-50 shadow-lg"
                            >
                                {posting ? 'Agregando…' : 'Agregar Manual'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}