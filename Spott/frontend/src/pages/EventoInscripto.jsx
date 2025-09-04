import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import SongVoting from '../components/SongVoting';

export default function EventoInscripto() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [loadingTracks, setLoadingTracks] = useState(true);

    if (!state?.evento) {
        return <p>No hay datos del evento.</p>;
    }

    const {
        id,
        imageSrc,
        title,
        description,
        rating,
        ciudad,
        barrio,
        tematica,
        musica
    } = state.evento;

    const desinscribirme = () => {
        const eventos = JSON.parse(localStorage.getItem('eventosUsuario')) || [];
        const actualizados = eventos.filter(e => e.id !== id);
        localStorage.setItem('eventosUsuario', JSON.stringify(actualizados));
        alert('Te desinscribiste del evento');
        navigate('/usuario');
    };

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
            </div>

            {/* SongVoting corregido */}
            <SongVoting
                eventoId={id}
                usuarioInscrito={state?.usuarioInscrito ?? true}
                userId={state?.userId}
                generoEvento={musica}
            />

            <FooterUsuario />
        </div>
    );
}
