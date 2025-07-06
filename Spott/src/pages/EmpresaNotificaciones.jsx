import { useNavigate } from 'react-router-dom';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import crearImg from '../img/CrearLogo.jpeg';
import '../app.css';

export default function EmpresaNotificaciones() {
    const navigate = useNavigate();

    return (
        <div className="not">
        {/* Header */}
        <header className="header_notificaciones">
            <button onClick={() => navigate('/empresa')}>
            <span id="back">Volver</span>
            </button>
            <h1>Notificaciones</h1>
            <button onClick={() => window.location.reload()}>
            <span id="back">Limpiar</span>
            </button>
        </header>

        {/* Notificaciones */}
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

        {[...Array(4)].map((_, i) => (
            <div className="notificacion" key={i}>
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