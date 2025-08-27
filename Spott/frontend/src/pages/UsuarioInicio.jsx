import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import PresentCard from '../components/PresentCard';
import ApiService from '../services/api';
import FiltrosBusqueda from "../components/FiltrosBusqueda";
import '../app.css';

export default function UsuarioInicio() {
    const navigate = useNavigate();

    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [eventosInscritos, setEventosInscritos] = useState([]);
    const [filtros, setFiltros] = useState({});

    const validGenres = [
        "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "black-metal",
        "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop",
        "chicago-house", "chill", "classical", "club", "comedy", "country",
        "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco",
        "disney", "drum-and-bass", "dub", "dubstep", "electro", "electronic",
        "emo", "folk", "french", "funk", "garage", "german", "goth",
        "groove", "guitar", "happy", "hard-rock",
        "hardstyle", "heavy-metal", "hip-hop", "holidays", "house",
        "indie", "indie-pop", "industrial", "j-dance",
        "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "latin", "latino", 
        "mandopop", "metal", "metal-misc", "minimal-techno",
        "movies", "new-age", "new-release", "opera", "party",
        "piano", "pop", "pop-film", "post-dubstep", "power-pop",
        "progressive-house", "psych-rock", "punk", "punk-rock", "rainy-day",
        "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly",
        "romance", "sad", "salsa", "samba", "singer-songwriter",
        "songwriter", "soul", "soundtracks", "spanish",
        "summer", "swedish", "synth-pop", "tango", "techno", "trip-hop",
        "work-out", "world-music"
    ];

    // Cargar eventos desde el backend y como fallback desde Ticketmaster
    useEffect(() => {
        const cargarEventos = async () => {
            setCargando(true);
            setError(null);

            try {
                const responseBackend = await ApiService.obtenerEventos({ busqueda, ...filtros });
                let eventosBackend = responseBackend.eventos || [];
                
                if (eventosBackend.length < 6) {
                    try {
                        const apiKey = import.meta.env.VITE_TM_API;
                        const responseTicketmaster = await fetch(
                            `https://app.ticketmaster.com/discovery/v2/events.json?size=${6 - eventosBackend.length}&keyword=music&apikey=${apiKey}`
                        );

                        if (responseTicketmaster.ok) {
                            const dataTicketmaster = await responseTicketmaster.json();
                            const eventosTicketmaster = dataTicketmaster._embedded?.events || [];

                            const eventosTransformados = eventosTicketmaster.map(e => {
                                const generoTicketmaster = e.classifications?.[0]?.genre?.name?.toLowerCase() || '';
                                const generoValido = validGenres.includes(generoTicketmaster)
                                    ? generoTicketmaster
                                    : validGenres[Math.floor(Math.random() * validGenres.length)];

                                return {
                                    id: `ticketmaster-${e.id}`,
                                    imageSrc: e.images?.[0]?.url || '',
                                    title: e.name,
                                    description: e.info || e.description || 'Sin descripción disponible.',
                                    rating: (4 + Math.random()).toFixed(1),
                                    musica: generoValido,
                                    esExterno: true
                                };
                            });

                            eventosBackend = [...eventosBackend, ...eventosTransformados];
                        }
                    } catch (ticketmasterError) {
                        console.warn('Error al cargar eventos de Ticketmaster:', ticketmasterError);
                    }
                }

                setEventos(eventosBackend);
            } catch (backendError) {
                console.error('Error al cargar eventos del backend:', backendError);
                try {
                    const apiKey = import.meta.env.VITE_TM_API;
                    const response = await fetch(
                        `https://app.ticketmaster.com/discovery/v2/events.json?size=10&keyword=music&apikey=${apiKey}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const eventosRaw = data._embedded?.events || [];

                        const unicos = eventosRaw.filter(
                            (e, i, arr) => arr.findIndex(ev => ev.id === e.id) === i
                        );

                        const transformar = e => {
                            const generoTicketmaster = e.classifications?.[0]?.genre?.name?.toLowerCase() || '';
                            const generoValido = validGenres.includes(generoTicketmaster)
                                ? generoTicketmaster
                                : validGenres[Math.floor(Math.random() * validGenres.length)];

                            return {
                                id: `ticketmaster-${e.id}`,
                                imageSrc: e.images?.[0]?.url || '',
                                title: e.name,
                                description: e.info || e.description || 'Sin descripción disponible.',
                                rating: (4 + Math.random()).toFixed(1),
                                musica: generoValido,
                                esExterno: true
                            };
                        };

                        setEventos(unicos.slice(0, 6).map(transformar));
                    } else {
                        throw new Error('Error al cargar eventos');
                    }
                } catch (ticketmasterError) {
                    setError('Error al cargar eventos. Inténtalo más tarde.');
                }
            } finally {
                setCargando(false);
            }
        };

        cargarEventos();
    }, [busqueda, filtros]);

    // Cargar eventos inscritos del usuario
    useEffect(() => {
        const cargarEventosInscritos = async () => {
            try {
                const usuarioId = localStorage.getItem('usuarioId') || 'usuario-default-id';
                const response = await ApiService.obtenerEventosInscritos(usuarioId);
                setEventosInscritos(response.eventos || []);
            } catch (error) {
                console.error('Error al cargar eventos inscritos:', error);
                const guardados = JSON.parse(localStorage.getItem('eventosUsuario')) || [];
                setEventosInscritos(guardados);
            }
        };

        cargarEventosInscritos();
    }, []);

    const handleEventoClick = (evento) => {
        if (evento.esExterno) {
            navigate('/evento', { state: { evento, esExterno: true } });
        } else {
            navigate('/evento', { state: { evento } });
        }
    };

    return (
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />
            <div className='inicio'>
                
                {/* 🔎 Nuevo componente de búsqueda y filtros */}
                <FiltrosBusqueda 
                    busqueda={busqueda} 
                    setBusqueda={setBusqueda} 
                    onAplicarFiltros={setFiltros} 
                />

                {/* Eventos destacados */}
                <div className="destacados">
                    <h2 className="section-title">Eventos Destacados</h2>
                    {cargando && <p>Cargando eventos...</p>}
                    {error && <p style={{ color: '#ff4444' }}>Error: {error}</p>}
                    {!cargando && !error && eventos.map((evento, i) => (
                        <PresentCard
                            key={evento.id || `evento-${i}`}
                            imageSrc={evento.imageSrc}
                            title={evento.title}
                            description={evento.description}
                            rating={evento.rating}
                            onClick={() => handleEventoClick(evento)}
                        />
                    ))}
                </div>

                <FooterUsuario />
            </div>
        </div>
    );
}
