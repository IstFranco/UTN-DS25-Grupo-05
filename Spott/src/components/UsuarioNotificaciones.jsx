import { useNavigate } from 'react-router-dom';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import favImg from '../img/LogoFav.jpeg';
import '../app.css';

export default function UsuarioNotificaciones() {
    const navigate = useNavigate();

    return (
        <div className="not">
        {/* Header */}
        <header className="header_notificaciones">
            <button onClick={() => navigate('/usuario')}>
            <span id="back">Volver</span>
            </button>
            <h1>Notificaciones</h1>
            <button onClick={() => navigate('/usuario')}>
            <span id="back">Limpiar</span>
            </button>
        </header>

        {/* Lista de Notificaciones */}
        {[...Array(6)].map((_, index) => (
            <div className="notificacion" key={index}>
            <div className="notification-content">
                <span className="notification-icon">🔔</span>
                <div>
                <h3>Recordatorio</h3>
                <p>Evento mañana a las 20:00</p>
                <small>Hace 1 día</small>
                </div>
            </div>
            </div>
        ))}

        {/* Notificaciones específicas */}
        <div className="notificacion">
            <div className="notification-content">
            <span className="notification-icon">🎵</span>
            <div>
                <h3>Nuevo evento musical</h3>
                <p>Concierto este fin de semana</p>
                <small>Hace 2 horas</small>
            </div>
            </div>
        </div>
        <div className="notificacion">
            <div className="notification-content">
            <span className="notification-icon">👍</span>
            <div>
                <h3>Evento confirmado</h3>
                <p>Tu asistencia ha sido registrada</p>
                <small>Ayer</small>
            </div>
            </div>
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