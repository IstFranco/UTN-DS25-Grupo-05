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
        {/* Header Superior */}
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
            <button className="quick-btn">
            <span className="icon">Foto1</span>
            <span className="text">Acceso1</span>
            </button>
            <button className="quick-btn">
            <span className="icon">Foto2</span>
            <span className="text">Acceso2</span>
            </button>
            <button className="quick-btn">
            <span className="icon">Foto3</span>
            <span className="text">Acceso3</span>
            </button>
            <button className="quick-btn">
            <span className="icon">Foto4</span>
            <span className="text">Acceso4</span>
            </button>
        </section>

        {/* Eventos Activos del Mes */}
        <div className="destacados">
            <h2 className="section-title">Eventos Activos del Mes</h2>
            <article className="event-card">
            <div className="event-image">
                <img src="" alt="" />
            </div>
            <div className="event-info">
                <h3 className="event-title">Concierto de Verano</h3>
                <p className="event-description">
                Disfruta de los mejores artistas en nuestro festival anual.
                </p>
                <div className="event-rating">⭐ 4.7</div>
            </div>
            </article>
            <article className="event-card">
            <div className="event-image" />
            <div className="event-info">
                <h3 className="event-title">Exposición de Arte</h3>
                <p className="event-description">
                Obras contemporáneas de artistas emergentes.
                </p>
                <div className="event-rating">⭐ 4.9</div>
            </div>
            </article>
        </div>

        {/* Eventos con Mejor Valoración */}
        <div className="destacados">
            <h2 className="section-title">Eventos con Mejor Valoración</h2>
            <article className="event-card">
            <div className="event-image">
                <img src="" alt="" />
            </div>
            <div className="event-info">
                <h3 className="event-title">Concierto de Verano</h3>
                <p className="event-description">
                Disfruta de los mejores artistas en nuestro festival anual.
                </p>
                <div className="event-rating">⭐ 4.7</div>
            </div>
            </article>
            <article className="event-card">
            <div className="event-image" />
            <div className="event-info">
                <h3 className="event-title">Exposición de Arte</h3>
                <p className="event-description">
                Obras contemporáneas de artistas emergentes.
                </p>
                <div className="event-rating">⭐ 4.9</div>
            </div>
            </article>
        </div>

        {/* Footer Inferior */}
        <footer className="footer">
            <button className="footer-btn">
            <img src={explorarImg} id="logo" alt="Explorar" />
            Explorar
            </button>
            <button className="footer-btn" onClick={() => navigate('/empresa')}>
            <img src={homeImg} id="logo" alt="Inicio" />
            Inicio
            </button>
            <button
            className="footer-btn"
            onClick={() => navigate('/empresa/crearEvento')}
            >
            <img src={crearImg} id="logo" alt="Crear Evento" />
            Crear Evento
            </button>
        </footer>
        </div>
    );
}