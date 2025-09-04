import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import SongVoting from '../components/SongVoting';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';

export default function MostrarEvento() {
    const { state } = useLocation();
    const [usuarioInscrito, setUsuarioInscrito] = useState(false);
    const [usuarioData, setUsuarioData] = useState(null); // ← AGREGAR ESTE STATE

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
        musica,
        inscriptos,
        imagenes = []
    } = state.evento;

    // Verificar si el usuario ya está inscrito al cargar el componente
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("usuario") || "{}");
        setUsuarioData(userData); // ← GUARDAR LOS DATOS DEL USUARIO
        
        const usuarioId = userData.id;

        console.log('🔍 DEBUG - Evento actual ID:', id);
        console.log('🔍 DEBUG - Usuario ID:', usuarioId); // ← AGREGAR LOG

        if (!usuarioId) {
            console.error("No se encontró ID de usuario");
            return;
        }

        fetch(`http://localhost:3001/api/eventos/check/${id}/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
            setUsuarioInscrito(data.inscrito);
        })
        .catch(err => console.error("Error al verificar inscripción:", err));
    }, [id]);

    const inscribirme = async () => {
        try {
            // Usar usuarioData del state en lugar de obtenerlo de nuevo
            const usuarioId = usuarioData?.id;

            if (!usuarioId) {
                alert("Error: No se encontró información del usuario. Inicia sesión nuevamente.");
                return;
            }

            const res = await fetch(`http://localhost:3001/api/eventos/${id}/inscribirse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId, tipoEntrada: "general" })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al inscribirse");
            }

            const data = await res.json();
            console.log("Inscripción realizada:", data);

            setUsuarioInscrito(true);
            alert("¡Te inscribiste al evento!");
        } catch (err) {
            console.error(err);
            alert(`Error al inscribirse al evento: ${err.message}`);
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
                    {/* Encabezado con logo y título */}
                    <div className="evento-header">
                        <img className="evento-logo" src={imageSrc} alt="Logo evento" />
                        <div className="evento-titulo-box">
                            <h2 className="evento-titulo">{title}</h2>
                            <p className="evento-inscriptos">{inscriptos} inscriptos</p>
                        </div>
                    </div>

                    {/* Info del evento */}
                    <div className="evento-info">
                        <p className="evento-rating">⭐ {rating}</p>
                        <p className="evento-ubicacion">📍 {barrio}, {ciudad}</p>
                        <p className="evento-tematica">🎭 {tematica}</p>
                        <p className="evento-genero">🎵 {musica}</p>
                    </div>

                    {/* Descripción amplia */}
                    <div>
                        <h3>Descripción</h3>
                        <p>{description}</p>
                    </div>

                    {/* Galería de imágenes */}
                    <div className="evento-galeria">
                        <h3>Fotos del evento</h3>
                        <div className="galeria-scroll">
                            {imagenes.map((img, index) => (
                                <img key={index} src={img} alt={`foto-${index}`} className="galeria-img" />
                            ))}
                        </div>
                    </div>

                    {/* Botón de inscripción */}
                    <div className="evento-inscribirse">
                        {!usuarioInscrito ? (
                            <button className="btn-inscribirse" onClick={inscribirme}>
                                Inscribirme al evento
                            </button>
                        ) : (
                            <div className="inscripcion-confirmada">
                                ✅ ¡Ya estás inscrito!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Componente de votación de canciones - CORREGIDO: pasar userId */}
            <SongVoting 
                eventoId={id} 
                usuarioInscrito={usuarioInscrito} 
                userId={usuarioData?.id} // ← CORREGIDO: pasar el ID real del usuario
                generoEvento={musica} 
            />

            <FooterUsuario />
        </div>
    );
}