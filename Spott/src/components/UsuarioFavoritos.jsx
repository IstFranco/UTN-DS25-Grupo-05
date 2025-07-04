import { useNavigate } from 'react-router-dom';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import favImg from '../img/LogoFav.jpeg';
import '../app.css';

export default function UsuarioFavoritos() {
    const navigate = useNavigate();

    return (
        <div className="favoritos">
        {/* Header Superior */}
        <header className="header">
            <button onClick={() => navigate('/usuario')}>
            <span id="back">Volver</span>
            </button>
            <h1>Favoritos</h1>
            <div></div>
        </header>

        {/* Eventos Favoritos */}
        <div className="favoritos-seccion">
            <h2 className="section-title">Eventos favoritos</h2>
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
            <div className="event-image"></div>
            <div className="event-info">
                <h3 className="event-title">Exposición de Arte</h3>
                <p className="event-description">
                Obras contemporáneas de artistas emergentes.
                </p>
                <div className="event-rating">⭐ 4.9</div>
            </div>
            </article>
        </div>

        {/* Creadores Favoritos */}
        <div className="favoritos-seccion">
            <h2 className="section-title">Creadores favoritos</h2>
            <article className="event-card">
            <div className="event-image">
                <img src="" alt="" />
            </div>
            <div className="event-info">
                <h3 className="event-title">Nombre Apellido</h3>
                <p className="event-description">
                Disfruta de los mejores artistas en nuestro festival anual.
                </p>
                <div className="event-rating">⭐ 4.7</div>
            </div>
            </article>
            <article className="event-card">
            <div className="event-image"></div>
            <div className="event-info">
                <h3 className="event-title">Nombre Apellido</h3>
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
            <button className="footer-btn" onClick={() => navigate('/usuario')}>
            <img src={homeImg} id="logo" alt="Inicio" />
            Inicio
            </button>
            <button className="footer-btn" onClick={() => navigate('/usuario/favoritos')}>
            <img src={favImg} id="logo" alt="Favoritos" />
            Favoritos
            </button>
        </footer>
        </div>
    );
}