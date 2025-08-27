import React, { useState } from 'react';

const SongVoting = ({ eventoId, usuarioInscrito = false }) => {
    const [songs, setSongs] = useState([
        {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        votes: 42,
        userVote: null, // null, 'like', 'dislike'
        image: "/src/img/LogoExplorar.jpeg" // placeholder
        },
        {
        id: 2,
        title: "Bad Guy",
        artist: "Billie Eilish",
        votes: 38,
        userVote: null,
        image: "/src/img/LogoExplorar.jpeg"
        },
        {
        id: 3,
        title: "Levitating",
        artist: "Dua Lipa",
        votes: 35,
        userVote: null,
        image: "/src/img/LogoExplorar.jpeg"
        },
        {
        id: 4,
        title: "Stay",
        artist: "The Kid LAROI & Justin Bieber",
        votes: 29,
        userVote: null,
        image: "/src/img/LogoExplorar.jpeg"
        },
        {
        id: 5,
        title: "Montero (Call Me By Your Name)",
        artist: "Lil Nas X",
        votes: 27,
        userVote: null,
        image: "/src/img/LogoExplorar.jpeg"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddSong, setShowAddSong] = useState(false);
    const [newSong, setNewSong] = useState({
        title: '',
        artist: ''
    });

    // No mostrar si el usuario no está inscrito
    if (!usuarioInscrito) {
        return null;
    }

    const handleVote = (songId, voteType) => {
        setSongs(prevSongs => 
        prevSongs.map(song => {
            if (song.id === songId) {
            let newVotes = song.votes;
            
            // Si ya tenía un voto, lo removemos
            if (song.userVote === 'like') newVotes--;
            if (song.userVote === 'dislike') newVotes++;
            
            // Aplicamos el nuevo voto
            if (voteType === 'like' && song.userVote !== 'like') {
                newVotes++;
            } else if (voteType === 'dislike' && song.userVote !== 'dislike') {
                newVotes--;
            }
            
            return {
                ...song,
                votes: newVotes,
                userVote: song.userVote === voteType ? null : voteType
            };
            }
            return song;
        })
        );
    };

    const handleAddSong = () => {
        if (newSong.title.trim() && newSong.artist.trim()) {
        const newSongObj = {
            id: Math.max(...songs.map(s => s.id)) + 1,
            title: newSong.title,
            artist: newSong.artist,
            votes: 0,
            userVote: null,
            image: "/src/img/LogoExplorar.jpeg"
        };
        
        setSongs([...songs, newSongObj]);
        setNewSong({ title: '', artist: '' });
        setShowAddSong(false);
        }
    };

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedSongs = [...filteredSongs].sort((a, b) => b.votes - a.votes);

    return (
        <div className="song-voting-container">
        <div className="song-voting-header">
            <h2>Song Voting</h2>
            <button 
            className="btn-add-song"
            onClick={() => setShowAddSong(true)}
            >
            + Add Song
            </button>
        </div>

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
            {sortedSongs.map((song, index) => (
            <div key={song.id} className="song-item">
                <div className="song-rank">{index + 1}</div>
                
                <div className="song-info-container">
                <img 
                    src={song.image} 
                    alt={song.title}
                    className="song-image"
                />
                <div className="song-details">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                </div>
                </div>

                <div className="song-actions">
                <div className="song-votes">{song.votes}</div>
                
                <button
                    className={`vote-btn like-btn ${song.userVote === 'like' ? 'active' : ''}`}
                    onClick={() => handleVote(song.id, 'like')}
                >
                    👍
                </button>
                
                <button
                    className={`vote-btn dislike-btn ${song.userVote === 'dislike' ? 'active' : ''}`}
                    onClick={() => handleVote(song.id, 'dislike')}
                >
                    👎
                </button>
                </div>
            </div>
            ))}
        </div>

        {/* Modal para agregar canción */}
        {showAddSong && (
            <div className="add-song-modal">
            <div className="modal-content">
                <h3>Add New Song</h3>
                
                <input
                type="text"
                placeholder="Song title"
                value={newSong.title}
                onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                className="add-song-input"
                />
                
                <input
                type="text"
                placeholder="Artist name"
                value={newSong.artist}
                onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                className="add-song-input"
                />
                
                <div className="modal-actions">
                <button 
                    className="btn-cancel"
                    onClick={() => {
                    setShowAddSong(false);
                    setNewSong({ title: '', artist: '' });
                    }}
                >
                    Cancel
                </button>
                <button 
                    className="btn-confirm"
                    onClick={handleAddSong}
                >
                    Add Song
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default SongVoting;