import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';

export default function EventoInscripto() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [loadingTracks, setLoadingTracks] = useState(true);

    // Si no se pasó información del evento, mostramos un mensaje
    if (!state?.evento) {
        return <p>No hay datos del evento.</p>;
    }

    // Extraemos los datos del evento
    const {
        imageSrc,
        title,
        description,
        rating,
        ciudad,
        barrio,
        tematica,
        musica // Este será el género musical
    } = state.evento;

    // Lógica para desinscribirse del evento
    const desinscribirme = () => {
        const eventos = JSON.parse(localStorage.getItem('eventosUsuario')) || [];
        const actualizados = eventos.filter(e => e.title !== title);
        localStorage.setItem('eventosUsuario', JSON.stringify(actualizados));
        alert('Te desinscribiste del evento');
        navigate('/usuario');
    };

    useEffect(() => {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

        // Géneros válidos según Spotify
        const validGenres = ['pop', 'rock', 'hip-hop', 'edm', 'reggaeton', 'trap', 'latin', 'jazz', 'funk', 'k-pop'];
        const inputGenre = musica?.toLowerCase();
        const genre = validGenres.includes(inputGenre) ? inputGenre : 'pop';

        async function fetchTracks() {
            try {
                // Paso 1: Obtener token de acceso (client_credentials)
                // IMPORTANTE: Esto debería ir en el backend en producción.
                const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`) // codifica las credenciales
                    },
                    body: 'grant_type=client_credentials'
                });

                const tokenData = await tokenRes.json();
                const accessToken = tokenData.access_token;

                if (!accessToken) {
                    console.error("No se recibió access_token");
                    setLoadingTracks(false);
                    return;
                }

                // Paso 2: Obtener canciones recomendadas usando `seed_genres`
                const recRes = await fetch(
                    `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=10`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                if (!recRes.ok) {
                    const errorText = await recRes.text();
                    console.error("Error al obtener recomendaciones:", recRes.status, errorText);
                    setLoadingTracks(false);
                    return;
                }

                const recData = await recRes.json();
                setTracks(recData.tracks || []);
            } catch (err) {
                console.error('Error general al obtener canciones de Spotify:', err);
            } finally {
                setLoadingTracks(false);
            }
        }

        fetchTracks();
    }, [musica]); // Se vuelve a ejecutar si cambia el género

    return (
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />

            <div className="mostrar-evento">
                <div className="evento-card">
                    <div className="evento-header">
                        <img className="evento-logo" src={imageSrc} alt="Logo evento" />
                        <div className="evento-titulo-box">
                            <h2 className="evento-titulo">{title}</h2>
                        </div>
                    </div>

                    <div className="evento-info">
                        <p className="evento-rating">⭐ {rating}</p>
                        <p className="evento-ubicacion">📍 {barrio}, {ciudad}</p>
                        <p className="evento-tematica">🎭 {tematica}</p>
                        <p className="evento-genero">🎵 {musica}</p>
                    </div>

                    <h3>Descripción</h3>
                    <p>{description}</p>

                    <div className="evento-inscribirse">
                        <button className="btn-inscribirse" onClick={desinscribirme}>
                            Desinscribirme
                        </button>
                    </div>
                </div>

                <section className="canciones-relacionadas">
                    <h3>Canciones recomendadas</h3>
                    {loadingTracks ? (
                        <p>Cargando canciones...</p>
                    ) : tracks.length > 0 ? (
                        <ul>
                            {tracks.map((t, i) => (
                                <li key={i}>
                                    {t.name} — {t.artists.map(a => a.name).join(', ')}
                                    {t.preview_url && (
                                        <audio controls src={t.preview_url} style={{ marginLeft: '8px' }} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No se encontraron canciones para el género "{musica}".</p>
                    )}
                </section>
            </div>

            <FooterUsuario />
        </div>
    );
}