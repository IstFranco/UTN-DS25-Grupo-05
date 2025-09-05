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

    const desinscribirme = async () => {
        console.log('🔴 BOTÓN DESINSCRIBIRSE CLICKEADO EN EVENTO INSCRIPTO');
        
        if (!window.confirm('¿Estás seguro de que deseas desinscribirte de este evento?')) {
            return;
        }
        
        try {
            const usuarioData = JSON.parse(localStorage.getItem("usuario") || "{}");
            const usuarioId = usuarioData.id;

            if (!usuarioId) {
                alert("Error: No se encontró información del usuario. Inicia sesión nuevamente.");
                return;
            }

            const res = await fetch(`http://localhost:3001/api/eventos/${id}/usuario/${usuarioId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al desinscribirse");
            }

            const data = await res.json();
            console.log("Desinscripción realizada:", data);

            // Actualizar localStorage también
            const eventos = JSON.parse(localStorage.getItem('eventosUsuario')) || [];
            const actualizados = eventos.filter(e => e.id !== id);
            localStorage.setItem('eventosUsuario', JSON.stringify(actualizados));
            
            alert("Te has desinscrito del evento exitosamente");
            navigate('/usuario');
        } catch (err) {
            console.error(err);
            alert(`Error al desinscribirse del evento: ${err.message}`);
        }
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
