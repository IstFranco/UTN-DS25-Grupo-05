import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import SongVoting from '../components/SongVoting';
import { useAuth } from '../contexts/AuthContext';

export default function EventoInscripto() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { user } = useAuth(); 

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
        if (!window.confirm('¿Estás seguro de que deseas desinscribirte de este evento?')) {
            return;
        }

        try {
            if (!user?.userId) {
                alert("Error: No se encontró información del usuario. Inicia sesión nuevamente.");
                return;
            }

            setLoading(true);

            const res = await fetch(`http://localhost:3000/api/eventos/${id}/usuario/${user.userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al desinscribirse");
            }

            const data = await res.json();
            console.log("✅ Desinscripción realizada:", data);

            alert("Te has desinscrito del evento exitosamente");
            navigate('/usuario'); // Redirigir al inicio del usuario
        } catch (err) {
            console.error(err);
            alert(`Error al desinscribirse del evento: ${err.message}`);
        } finally {
            setLoading(false);
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
                        <button 
                            className="btn-inscribirse" 
                            onClick={desinscribirme}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Desinscribirme"}
                        </button>
                    </div>
                </div>
            </div>

            
            <SongVoting
                eventoId={id}
                usuarioInscrito={state?.usuarioInscrito ?? true}
                userId={user?.userId}
                generoEvento={musica}
            />

            <FooterUsuario />
        </div>
    );
}
