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

    if (!state?.evento) {
        return <p>No hay datos del evento.</p>;
    }

    const {
        imageSrc,           // logo del evento
        title,
        description,
        rating,
        ciudad,
        barrio,
        tematica,
        musica,
        inscriptos,
        imagenes = []       // array de fotos adicionales
    } = state.evento;

    // Verificar si el usuario ya está inscrito al cargar el componente
    useEffect(() => {
        const eventosInscritos = JSON.parse(localStorage.getItem('eventosUsuario')) || [];
        const yaInscripto = eventosInscritos.some(e => e.title === title);
        setUsuarioInscrito(yaInscripto);
    }, [title]);

    const inscribirme = () => {
    const eventosInscritos = JSON.parse(localStorage.getItem('eventosUsuario')) || [];

    // Evitar duplicados por título
    const yaInscripto = eventosInscritos.some(e => e.title === title);
    if (!yaInscripto) {
        eventosInscritos.push({
        imageSrc,
        title,
        description,
        rating,
        ciudad,
        barrio,
        tematica,
        musica
        });
        localStorage.setItem('eventosUsuario', JSON.stringify(eventosInscritos));
        setUsuarioInscrito(true);
        alert('¡Te inscribiste al evento!');
    } else {
        alert('Ya estás inscripto en este evento.');
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

{/* Componente de votación de canciones - solo se muestra si está inscrito */}
                <SongVoting 
                    eventoId={title} // usando title como ID único
                    usuarioInscrito={usuarioInscrito} 
                />
            <FooterUsuario />
        </div>
    );
}