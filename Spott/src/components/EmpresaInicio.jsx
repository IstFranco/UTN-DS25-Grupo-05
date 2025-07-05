import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import crearImg from '../img/CrearLogo.jpeg';
import '../app.css';

export default function EmpresaInicio() {
    const navigate = useNavigate();

    return (
        <div className="inicio">
        {/* Header */}
        <header className="header">
            <button onClick={() => navigate('/empresa/perfil')}>
            <img src={perfilImg} alt="Perfil" id="logo" />
            </button>
            <h1>Spott</h1>
            <button onClick={() => navigate('/empresa/notificaciones')}>
            <img src={notiImg} alt="Notificaciones" id="logo" />
            </button>
        </header>

        {/* Accesos Rápidos */}
        <section className="quick-access">
            {[1, 2, 3, 4].map(i => (
            <button className="quick-btn" key={i}>
                <span className="icon">Foto{i}</span>
                <span className="text">Acceso{i}</span>
            </button>
            ))}
        </section>

        {/* Eventos Activos */}
        <div className="destacados">
            <h2 className="section-title">Eventos Activos del Mes</h2>
            {[1, 2].map((_, i) => (
            <article className="event-card" key={`activo-${i}`}>
                <div className="event-image"></div>
                <div className="event-info">
                <h3 className="event-title">Concierto de Verano</h3>
                <p className="event-description">Disfruta de los mejores artistas en nuestro festival anual.</p>
                <div className="event-rating">⭐ 4.{7 + i}</div>
                </div>
            </article>
            ))}
        </div>

        {/* Eventos con Mejor Valoración */}
        <div className="destacados">
            <h2 className="section-title">Eventos con Mejor Valoracion</h2>
            {[1, 2].map((_, i) => (
            <article className="event-card" key={`valorado-${i}`}>
                <div className="event-image"></div>
                <div className="event-info">
                <h3 className="event-title">Exposición de Arte</h3>
                <p className="event-description">Obras contemporáneas de artistas emergentes.</p>
                <div className="event-rating">⭐ 4.{9 - i}</div>
                </div>
            </article>
            ))}
        </div>

        {/* Footer */}
        <footer className="footer">
            <button className="footer-btn">
            <img src={explorarImg} id="logo" alt="Explorar" />
            Explorar
            </button>
            <button className="footer-btn" onClick={() => navigate('/empresa')}>
            <img src={homeImg} id="logo" alt="Inicio" />
            Inicio
            </button>
            <button className="footer-btn" onClick={() => navigate('/empresa/crear')}>
            <img src={crearImg} id="logo" alt="Crear Evento" />
            Crear Evento
            </button>
        </footer>
        </div>
    );
}