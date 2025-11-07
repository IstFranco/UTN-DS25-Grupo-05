import React, { useEffect, useMemo, useState } from 'react';

const API = import.meta?.env?.VITE_TM_API || 'http://localhost:3000';

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

export default function SongVoting({ 
    eventoId, 
    usuarioInscrito = false,
    userId, 
    generoEvento,
    esReadOnly = false
}) {
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
        if ((!usuarioInscrito && !esReadOnly) || !eventoId) return;
        
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
    }, [usuarioInscrito, esReadOnly, eventoId, effectiveUserId]);

    const filteredSongs = useMemo(() => {
        if (!searchTerm.trim()) return songs;
        const normSearch = normalize(searchTerm);
        return songs.filter(s => 
            normalize(s.title).includes(normSearch) || 
            normalize(s.artist).includes(normSearch)
        );
    }, [songs, searchTerm]);

    const sortedSongs = useMemo(() => {
        return [...filteredSongs].sort((a, b) => {
            const scoreA = (a.votesUp || 0) - (a.votesDown || 0);
            const scoreB = (b.votesUp || 0) - (b.votesDown || 0);
            return scoreB - scoreA;
        });
    }, [filteredSongs]);

    if (!usuarioInscrito && !esReadOnly) return null;

    const handleAddSong = async () => {
        if (!newSong.title.trim() || !newSong.artist.trim()) {
            alert('Por favor completa todos los campos');
            return;
        }

        setPosting(true);
        try {
            const res = await fetch(`${API}/api/canciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventoId,
                    titulo: newSong.title.trim(),
                    artista: newSong.artist.trim(),
                    usuarioId: effectiveUserId
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Error al agregar canción');
            }

            const data = await res.json();
            const added = {
                id: data.cancion.id,
                title: data.cancion.titulo,
                artist: data.cancion.artista,
                votesUp: 0,
                votesDown: 0,
                image: PLACEHOLDER_IMG,
                userVote: null,
                userVoteId: null
            };

            setSongs(prev => [...prev, added]);
            setNewSong({ title: '', artist: '' });
            setShowAddSong(false);
            alert('¡Canción agregada exitosamente!');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al agregar la canción');
        } finally {
            setPosting(false);
        }
    };

    const searchSpotify = async () => {
        if (!spQuery.trim()) return;

        setSpLoading(true);
        setSpError(null);
        setSpResults([]);

        try {
            const res = await fetch(
                `${API}/api/spotify/search?q=${encodeURIComponent(spQuery)}&genre=${encodeURIComponent(generoEvento || '')}`
            );
            if (!res.ok) throw new Error('Error en la búsqueda');

            const data = await res.json();
            setSpResults(data.tracks || []);
        } catch (err) {
            console.error(err);
            setSpError(err.message || 'Error al buscar en Spotify');
        } finally {
            setSpLoading(false);
        }
    };

    const addFromSpotify = async (track) => {
        setPosting(true);
        try {
            const res = await fetch(`${API}/api/canciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventoId,
                    titulo: track.name,
                    artista: track.artists.map(a => a.name).join(', '),
                    usuarioId: effectiveUserId,
                    spotifyId: track.id
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Error al agregar canción');
            }

            const data = await res.json();
            const added = {
                id: data.cancion.id,
                title: data.cancion.titulo,
                artist: data.cancion.artista,
                votesUp: 0,
                votesDown: 0,
                image: track.album?.images?.[0]?.url || PLACEHOLDER_IMG,
                userVote: null,
                userVoteId: null
            };

            setSongs(prev => [...prev, added]);
            setShowAddSong(false);
            setSpQuery('');
            setSpResults([]);
            alert('¡Canción agregada desde Spotify!');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al agregar la canción');
        } finally {
            setPosting(false);
        }
    };

    const handleVote = async (songId, voteType) => {
        const song = songs.find(s => s.id === songId);
        if (!song || song._busy) return;

        setSongs(prev => prev.map(s => 
            s.id === songId ? { ...s, _busy: true } : s
        ));

        try {
            if (song.userVote === voteType) {
                const res = await fetch(`${API}/api/votos/${song.userVoteId}`, {
                    method: 'DELETE'
                });

                if (!res.ok) throw new Error('Error al eliminar voto');

                setSongs(prev => prev.map(s => {
                    if (s.id !== songId) return s;
                    return {
                        ...s,
                        votesUp: voteType === 'like' ? s.votesUp - 1 : s.votesUp,
                        votesDown: voteType === 'dislike' ? s.votesDown - 1 : s.votesDown,
                        userVote: null,
                        userVoteId: null,
                        _busy: false
                    };
                }));
            } else {
                if (song.userVote) {
                    await fetch(`${API}/api/votos/${song.userVoteId}`, {
                        method: 'DELETE'
                    });
                }

                const res = await fetch(`${API}/api/votos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cancionId: songId,
                        usuarioId: effectiveUserId,
                        tipo: voteType === 'like' ? 'up' : 'down'
                    })
                });

                if (!res.ok) throw new Error('Error al votar');

                const data = await res.json();

                setSongs(prev => prev.map(s => {
                    if (s.id !== songId) return s;
                    
                    let newUp = s.votesUp;
                    let newDown = s.votesDown;

                    if (s.userVote === 'like') newUp -= 1;
                    if (s.userVote === 'dislike') newDown -= 1;

                    if (voteType === 'like') newUp += 1;
                    if (voteType === 'dislike') newDown += 1;

                    return {
                        ...s,
                        votesUp: newUp,
                        votesDown: newDown,
                        userVote: voteType,
                        userVoteId: data.voto.id,
                        _busy: false
                    };
                }));
            }
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error al procesar el voto');
            setSongs(prev => prev.map(s => 
                s.id === songId ? { ...s, _busy: false } : s
            ));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 mt-6">
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {esReadOnly ? '🎵 Canciones del Evento' : '🎵 Votación de Canciones'}
                    </h2>

                    {!esReadOnly && (
                        <button 
                            onClick={() => setShowAddSong(true)} 
                            disabled={posting}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
                        >
                            + Agregar Canción
                        </button>
                    )}
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

                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Buscar canción o artista..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-purple-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                </div>

                <div className="space-y-3">
                    {sortedSongs.map((song, index) => {
                        const score = (song.votesUp || 0) - (song.votesDown || 0);
                        return (
                            <div 
                                key={song.id} 
                                className={`flex items-center gap-4 bg-slate-900/50 border border-purple-700/30 rounded-lg p-4 transition ${song._busy ? 'opacity-50' : ''}`}
                            >
                                <div className="text-slate-400 font-bold text-lg w-8 text-center">
                                    #{index + 1}
                                </div>

                                <img 
                                    src={song.image} 
                                    alt={song.title}
                                    className="w-16 h-16 rounded-lg object-cover border-2 border-purple-600/50"
                                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                                />

                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{song.title}</h3>
                                    <p className="text-slate-400 text-sm">{song.artist}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-white font-bold text-lg w-12 text-center">
                                        {score}
                                    </div>

                                    {!esReadOnly && (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {!esReadOnly && showAddSong && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-purple-900/40 backdrop-blur-md border border-purple-700/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">Agregar Canción</h3>

                        <div className="mb-6">
                            <h4 className="text-white font-semibold mb-3">Buscar en Spotify</h4>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Buscar canción en Spotify..."
                                    value={spQuery}
                                    onChange={(e) => setSpQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchSpotify()}
                                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-purple-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                                />
                                <button
                                    onClick={searchSpotify}
                                    disabled={spLoading}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                                >
                                    {spLoading ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>

                            {spError && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-2 rounded-lg mb-3 text-sm">
                                    {spError}
                                </div>
                            )}

                            {spResults.length > 0 && (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {spResults.map(track => (
                                        <div 
                                            key={track.id}
                                            className="flex items-center gap-3 bg-slate-900/50 border border-purple-700/30 rounded-lg p-3 hover:border-purple-500/50 transition"
                                        >
                                            <img 
                                                src={track.album?.images?.[0]?.url || PLACEHOLDER_IMG}
                                                alt={track.name}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-semibold text-sm">{track.name}</p>
                                                <p className="text-slate-400 text-xs">
                                                    {track.artists.map(a => a.name).join(', ')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => addFromSpotify(track)}
                                                disabled={posting}
                                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded transition disabled:opacity-50"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-purple-700/30 pt-4">
                            <h4 className="text-white font-semibold mb-3">O agregar manualmente</h4>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Título de la canción"
                                    value={newSong.title}
                                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-purple-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Artista"
                                    value={newSong.artist}
                                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-purple-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddSong}
                                disabled={posting}
                                className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {posting ? 'Agregando...' : 'Agregar Canción'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddSong(false);
                                    setNewSong({ title: '', artist: '' });
                                    setSpQuery('');
                                    setSpResults([]);
                                }}
                                className="px-6 bg-slate-900/50 border border-purple-700/50 text-white font-semibold py-3 rounded-lg hover:bg-slate-800/50 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}